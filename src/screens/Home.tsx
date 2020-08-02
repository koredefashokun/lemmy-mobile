import React from 'react';
import { retryWhen, delay, take } from 'rxjs/operators';
import {
  wsJsonToRes,
  editPostFindRes,
  createPostLikeFindRes,
  fetchLimit,
  commentsToFlatNodes
} from '../utils';
// import { i18n } from "../i18next";
import {
  UserOperation,
  GetFollowedCommunitiesResponse,
  ListCommunitiesResponse,
  GetSiteResponse,
  SiteResponse,
  GetPostsResponse,
  PostResponse,
  ListingType,
  AddAdminResponse,
  BanUserResponse,
  WebSocketJsonResponse,
  CommunityUser,
  Community,
  Post,
  DataType,
  SortType,
  GetPostsForm,
  GetCommentsForm
} from '../interfaces';
import CommentNodes from '../components/CommentNodes';
import PostListings from '../components/PostListings';
import { SitesContext } from '../contexts/SitesContext';
import { AuthContext } from '../contexts/AuthContext';
import useWebSocketService from '../hooks/useWebSocketService';

interface MainState {
  subscribedCommunities: Array<CommunityUser>;
  trendingCommunities: Array<Community>;
  siteRes: GetSiteResponse;
  showEditSite: boolean;
  loading: boolean;
  fetchingMore: boolean;
  posts: Array<Post>;
  comments: Array<Comment>;
  listingType: ListingType;
  dataType: DataType;
  sort: SortType;
  page: number;
}

const Home: React.FC = () => {
  const initialState: MainState = {
    subscribedCommunities: [],
    trendingCommunities: [],
    siteRes: {
      site: {
        id: null,
        name: null,
        creator_id: null,
        creator_name: null,
        published: null,
        number_of_users: null,
        number_of_posts: null,
        number_of_comments: null,
        number_of_communities: null,
        enable_downvotes: null,
        open_registration: null,
        enable_nsfw: null
      } as any,
      admins: [],
      banned: [],
      online: null as any
    },
    showEditSite: false,
    loading: true,
    fetchingMore: false,
    posts: [],
    comments: [],
    listingType: ListingType.All,
    dataType: DataType.Post,
    sort: SortType.TopAll,
    page: 1
  };

  const [state, setState] = React.useReducer(
    (p: any, n: any) => ({
      ...p,
      ...n,
      ...(n.posts ? { posts: [...p.posts, ...n.posts] } : {})
    }),
    initialState
  );

  const { activeSite } = React.useContext(SitesContext);
  // @ts-ignore
  const service = useWebSocketService({ activeSite, loading: false });
  const { user } = React.useContext(AuthContext);

  React.useEffect(() => {
    const subscription = service?.subject
      .pipe(retryWhen((errors) => errors.pipe(delay(3000), take(10))))
      .subscribe(parseMessage, console.error, () => console.log('complete'));
    service?.getFollowedCommunities();
    fetchData();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    console.log(state.posts.length);
  }, [state.posts]);

  const fetchData = () => {
    if (state.dataType === DataType.Post) {
      let getPostsForm: GetPostsForm = {
        page: state.page,
        limit: fetchLimit,
        sort: SortType[state.sort],
        type_: ListingType[state.listingType]
      };
      service?.getPosts(getPostsForm);
    } else {
      let getCommentsForm: GetCommentsForm = {
        page: state.page,
        limit: fetchLimit,
        sort: SortType[state.sort],
        type_: ListingType[state.listingType]
      };
      service?.getComments(getCommentsForm);
    }
  };

  const handleLoadMore = () => {
    setState({ fetchingMore: true, page: state.page + 1 });
  };

  React.useEffect(() => {
    if (state.page > 1) fetchData();
  }, [state.page]);

  const parseMessage = (msg: WebSocketJsonResponse) => {
    let res = wsJsonToRes(msg);
    if (msg.error) {
      // toast(i18n.t(msg.error), 'danger');
      return;
    } else if (msg.reconnect) {
      fetchData();
    } else if (res.op === UserOperation.GetFollowedCommunities) {
      let data = res.data as GetFollowedCommunitiesResponse;
      setState({ subscribedCommunities: data.communities });
    } else if (res.op === UserOperation.ListCommunities) {
      let data = res.data as ListCommunitiesResponse;
      setState({ trendingCommunities: data.communities });
    } else if (res.op === UserOperation.GetSite) {
      let data = res.data as GetSiteResponse;

      // This means it hasn't been set up yet
      if (!data.site) {
        // context.router.history.push('/setup');
      }
      setState({
        siteRes: {
          ...state.siteRes,
          admins: data.admins,
          site: data.site,
          banned: data.banned,
          online: data.online
        }
      });
      // document.title = `${state.siteRes.site.name}`;
    } else if (res.op === UserOperation.EditSite) {
      let data = res.data as SiteResponse;
      setState({
        siteRes: { ...state.siteRes, site: data.site, showEditSite: false }
      });
      // toast(i18n.t('site_saved'));
    } else if (res.op === UserOperation.GetPosts) {
      let data = res.data as GetPostsResponse;

      // For some reason, state.posts seems to be empty at this point.
      // And logging state changes does not show why/when this happens.
      setState({ fetchingMore: false, posts: data.posts });
      // setupTippy();
    } else if (res.op === UserOperation.CreatePost) {
      let data = res.data as PostResponse;

      // If you're on subscribed, only push it if you're subscribed.
      if (state.listingType === ListingType.Subscribed) {
        if (
          state.subscribedCommunities
            .map((c: any) => c.community_id)
            .includes(data.post.community_id)
        ) {
          state.posts.unshift(data.post);
        }
      } else {
        // NSFW posts
        let nsfw = data.post.nsfw || data.post.community_nsfw;

        // Don't push the post if its nsfw, and don't have that setting on
        if (!nsfw || (nsfw && user && user.show_nsfw)) {
          state.posts.unshift(data.post);
        }
      }
      setState(state);
    } else if (res.op === UserOperation.EditPost) {
      let data = res.data as PostResponse;
      editPostFindRes(data, state.posts);
      setState(state);
    } else if (res.op === UserOperation.CreatePostLike) {
      let data = res.data as PostResponse;
      createPostLikeFindRes(data, state.posts);
      setState(state);
    } else if (res.op === UserOperation.AddAdmin) {
      let data = res.data as AddAdminResponse;
      setState({ siteRes: { ...state.siteRes, admins: data.admins } });
    } else if (res.op === UserOperation.BanUser) {
      let data = res.data as BanUserResponse;
      let found = state.siteRes.banned.find((u: any) => (u.id = data.user.id));

      // Remove the banned if its found in the list, and the action is an unban
      if (found && !data.banned) {
        state.siteRes.banned = state.siteRes.banned.filter(
          (i: any) => i.id !== data.user.id
        );
      } else {
        state.siteRes.banned.push(data.user);
      }
    }
  };

  return state.dataType === DataType.Post ? (
    <PostListings
      posts={state.posts}
      showCommunity
      removeDuplicates
      sort={state.sort}
      enableDownvotes={state.siteRes.site.enable_downvotes}
      enableNsfw={state.siteRes.site.enable_nsfw}
      fetchingMore={state.fetchingMore}
      loadMore={handleLoadMore}
    />
  ) : (
    <CommentNodes
      nodes={commentsToFlatNodes(state.comments as any)}
      noIndent
      showCommunity
      sortType={state.sort}
      showContext
      enableDownvotes={state.siteRes.site.enable_downvotes}
    />
  );
};

export default Home;
