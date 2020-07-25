import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { retryWhen, delay, take } from 'rxjs/operators';
import {
  wsJsonToRes,
  editPostFindRes,
  createPostLikeFindRes,
  getDataTypeFromProps,
  getPageFromProps,
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
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/theme';
import { AuthContext } from '../contexts/AuthContext';

interface MainState {
  subscribedCommunities: Array<CommunityUser>;
  trendingCommunities: Array<Community>;
  siteRes: GetSiteResponse;
  showEditSite: boolean;
  loading: boolean;
  posts: Array<Post>;
  comments: Array<Comment>;
  listingType: ListingType;
  dataType: DataType;
  sort: SortType;
  page: number;
}

const Home: React.FC = (props) => {
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
      },
      admins: [],
      banned: [],
      online: null
    },
    showEditSite: false,
    loading: true,
    posts: [],
    comments: [],
    listingType: ListingType.All,
    dataType: getDataTypeFromProps(props),
    sort: SortType.TopAll,
    page: getPageFromProps(props)
  };

  const [state, setState] = React.useReducer(
    (p: typeof initialState, n: typeof initialState) => ({ ...p, ...n }),
    initialState
  );

  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={() => {
            navigation.navigate('SiteSelector');
          }}
        >
          <Feather name='menu' color={colors.green} size={28} />
        </TouchableOpacity>
      )
    });
  }, []);

  const { service } = React.useContext(SitesContext);
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

  const parseMessage = (msg: WebSocketJsonResponse) => {
    let res = wsJsonToRes(msg);
    if (msg.error) {
      // toast(i18n.t(msg.error), 'danger');
      return;
    } else if (msg.reconnect) {
      fetchData();
    } else if (res.op === UserOperation.GetFollowedCommunities) {
      let data = res.data as GetFollowedCommunitiesResponse;
      state.subscribedCommunities = data.communities;
      setState(state);
    } else if (res.op === UserOperation.ListCommunities) {
      let data = res.data as ListCommunitiesResponse;
      state.trendingCommunities = data.communities;
      setState(state);
    } else if (res.op === UserOperation.GetSite) {
      let data = res.data as GetSiteResponse;

      // This means it hasn't been set up yet
      if (!data.site) {
        // context.router.history.push('/setup');
      }
      state.siteRes.admins = data.admins;
      state.siteRes.site = data.site;
      state.siteRes.banned = data.banned;
      state.siteRes.online = data.online;
      setState(state);
      document.title = `${state.siteRes.site.name}`;
    } else if (res.op === UserOperation.EditSite) {
      let data = res.data as SiteResponse;
      state.siteRes.site = data.site;
      state.showEditSite = false;
      setState(state);
      // toast(i18n.t('site_saved'));
    } else if (res.op === UserOperation.GetPosts) {
      let data = res.data as GetPostsResponse;
      state.posts = data.posts;
      state.loading = false;
      setState(state);
      // setupTippy();
    } else if (res.op === UserOperation.CreatePost) {
      let data = res.data as PostResponse;

      // If you're on subscribed, only push it if you're subscribed.
      if (state.listingType === ListingType.Subscribed) {
        if (
          state.subscribedCommunities
            .map((c) => c.community_id)
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
      state.siteRes.admins = data.admins;
      setState(state);
    } else if (res.op === UserOperation.BanUser) {
      let data = res.data as BanUserResponse;
      let found = state.siteRes.banned.find((u) => (u.id = data.user.id));

      // Remove the banned if its found in the list, and the action is an unban
      if (found && !data.banned) {
        state.siteRes.banned = state.siteRes.banned.filter(
          (i) => i.id !== data.user.id
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
    />
  ) : (
    <CommentNodes
      nodes={commentsToFlatNodes(state.comments)}
      noIndent
      showCommunity
      sortType={state.sort}
      showContext
      enableDownvotes={state.siteRes.site.enable_downvotes}
    />
  );
};

export default Home;
