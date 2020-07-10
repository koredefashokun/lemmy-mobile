import React from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { retryWhen, delay, take } from 'rxjs/operators';
import {
  CommentNode as CommentNodeI,
  Post as PostI,
  CommentSortType,
  Community,
  CommunityUser,
  GetSiteResponse,
  UserOperation,
  GetPostResponse,
  SearchForm,
  SearchType,
  SortType,
  CommentResponse,
  PostResponse,
  CommunityResponse,
  BanFromCommunityResponse,
  AddModToCommunityResponse,
  BanUserResponse,
  AddAdminResponse,
  SearchResponse,
  GetCommunityResponse,
  WebSocketJsonResponse,
} from '../interfaces';
import CommentNodes from './CommentNodes';
import {
  wsJsonToRes,
  editCommentRes,
  saveCommentRes,
  createCommentLikeRes,
  createPostLikeRes,
} from '../utils';
import { i18n } from '../i18next';
import useWebSocketService from '../hooks/useWebSocketService';
import { useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PostListing from './PostListing';
import { MainStackParamList } from '../../App';

interface PostState {
  post: PostI | null;
  comments: Array<Comment>;
  commentSort: CommentSortType;
  community: Community | null;
  moderators: Array<CommunityUser>;
  online: number | null;
  scrolled?: boolean;
  scrolled_comment_id?: number;
  loading: boolean;
  crossPosts: Array<PostI>;
  siteRes: GetSiteResponse;
}

const initialState: PostState = {
  post: null,
  comments: [],
  commentSort: CommentSortType.Hot,
  community: null,
  moderators: [],
  online: null,
  scrolled: false,
  loading: true,
  crossPosts: [],
  siteRes: {
    admins: [],
    banned: [],
    site: {
      id: undefined,
      name: undefined,
      creator_id: undefined,
      published: undefined,
      creator_name: undefined,
      number_of_users: undefined,
      number_of_posts: undefined,
      number_of_comments: undefined,
      number_of_communities: undefined,
      enable_downvotes: undefined,
      open_registration: undefined,
      enable_nsfw: undefined,
    },
    online: null,
  },
};

const Post: React.FC = () => {
  const [state, setState] = React.useReducer(
    (p: any, n: any) => ({ ...p, ...n }),
    initialState
  );
  const service = useWebSocketService();
  const { params } = useRoute<RouteProp<MainStackParamList, 'Post'>>();

  const handleCommentSortChange = (event: any) => {
    setState({ commentSort: Number(event.target.value) });
  };

  const buildCommentsTree = (): Array<CommentNodeI> => {
    let map = new Map<number, CommentNodeI>();
    for (let comment of state.comments) {
      let node: CommentNodeI = {
        comment: comment,
        children: [],
      };
      map.set(comment.id, { ...node });
    }
    let tree: Array<CommentNodeI> = [];
    for (let comment of state.comments) {
      let child = map.get(comment.id);
      if (comment.parent_id) {
        let parent_ = map.get(comment.parent_id);
        child && parent_?.children?.push(child);
      } else {
        child && tree.push(child);
      }
      child && setDepth(child);
    }

    return tree;
  };

  const setDepth = (node: CommentNodeI, i: number = 0): void => {
    if (node.children) {
      for (let child of node.children) {
        child.comment.depth = i;
        setDepth(child, i + 1);
      }
    }
  };

  const commentsTree = () => {
    let nodes = buildCommentsTree();

    return (
      <CommentNodes
        nodes={nodes}
        locked={state.post.locked}
        moderators={state.moderators}
        admins={state.siteRes.admins}
        postCreatorId={state.post.creator_id}
        sort={state.commentSort}
        enableDownvotes={state.siteRes.site.enable_downvotes}
      />
    );
  };

  const parseMessage = (msg: WebSocketJsonResponse) => {
    let res = wsJsonToRes(msg);
    if (msg.error) {
      // toast(i18n.t(msg.error), "danger");
      return;
    } else if (msg.reconnect) {
      service.getPost({ id: params.postId });
    } else if (res.op === UserOperation.GetPost) {
      let data = res.data as GetPostResponse;

      // Get cross-posts
      const post_url = data.post.url;

      setState({
        post: data.post,
        comments: data.comments,
        community: data.community,
        moderators: data.moderators,
        siteRes: { ...state.siteRes, admins: data.admins },
        online: data.online,
        loading: false,
      });

      if (post_url) {
        let form: SearchForm = {
          q: post_url,
          type_: SearchType[SearchType.Url],
          sort: SortType[SortType.TopAll],
          page: 1,
          limit: 6,
        };
        service.search(form);
      }
    } else if (res.op === UserOperation.CreateComment) {
      let data = res.data as CommentResponse;

      // Necessary since it might be a user reply
      if (data.recipient_ids.length === 0) {
        setState({ comments: state.comments.unshift(data.comment) });
      }
    } else if (res.op === UserOperation.EditComment) {
      let data = res.data as CommentResponse;
      editCommentRes(data, state.comments, (comments) =>
        setState({ comments })
      );
    } else if (res.op === UserOperation.SaveComment) {
      let data = res.data as CommentResponse;
      saveCommentRes(data, state.comments);
      setState(state);
    } else if (res.op === UserOperation.CreateCommentLike) {
      let data = res.data as CommentResponse;
      createCommentLikeRes(data, state.comments);
      setState(state);
    } else if (res.op === UserOperation.CreatePostLike) {
      let data = res.data as PostResponse;
      createPostLikeRes(data, state.post);
      setState(state);
    } else if (res.op === UserOperation.EditPost) {
      let data = res.data as PostResponse;
      setState({ post: data.post });
    } else if (res.op === UserOperation.SavePost) {
      let data = res.data as PostResponse;
      setState({ post: data.post });
    } else if (res.op === UserOperation.EditCommunity) {
      let data = res.data as CommunityResponse;
      setState({
        community: data.community,
        post: {
          ...state.post,
          community_id: data.community.id,
          community_name: data.community.name,
        },
      });
      setState(state);
    } else if (res.op === UserOperation.FollowCommunity) {
      let data = res.data as CommunityResponse;
      state.community.subscribed = data.community.subscribed;
      state.community.number_of_subscribers =
        data.community.number_of_subscribers;
      setState(state);
    } else if (res.op === UserOperation.BanFromCommunity) {
      let data = res.data as BanFromCommunityResponse;
      setState({
        comments: state.comments
          .filter((c) => c.creator_id === data.user.id)
          .forEach((c) => (c.banned_from_community = data.banned)),
      });
      if (state.post.creator_id === data.user.id) {
        setState({
          post: { ...state.post, banned_from_community: data.banned },
        });
      }
    } else if (res.op === UserOperation.AddModToCommunity) {
      let data = res.data as AddModToCommunityResponse;
      setState({ moderators: data.moderators });
    } else if (res.op === UserOperation.BanUser) {
      let data = res.data as BanUserResponse;
      setState({
        comments: state.comments
          .filter((c) => c.creator_id === data.user.id)
          .forEach((c) => (c.banned = data.banned)),
      });
      if (state.post.creator_id === data.user.id) {
        setState({ post: { ...state.post, banned: data.banned } });
      }
    } else if (res.op === UserOperation.AddAdmin) {
      let data = res.data as AddAdminResponse;
      setState({ siteRes: { ...state.siteRes, admins: data.admins } });
    } else if (res.op === UserOperation.Search) {
      let data = res.data as SearchResponse;
      const crossPosts = data.posts?.filter((p) => p.id != params.postId);
      setState({ crossPosts });
      if (state.crossPosts.length) {
        setState({ post: { ...state.post, duplicates: crossPosts } });
      }
    } else if (
      res.op === UserOperation.TransferSite ||
      res.op === UserOperation.GetSite
    ) {
      let data = res.data as GetSiteResponse;
      setState({ siteRes: data });
    } else if (res.op === UserOperation.TransferCommunity) {
      let data = res.data as GetCommunityResponse;
      setState({
        community: data.community,
        moderators: data.moderators,
        siteRes: { ...state.siteRes, admins: data.admins },
      });
    }
  };

  React.useEffect(() => {
    const subscription = service?.subject
      .pipe(retryWhen((errors) => errors.pipe(delay(3000), take(10))))
      .subscribe(parseMessage, console.error, () => console.log('complete'));

    let form: GetPostForm = { id: params.postId };

    service.getPost(form);
    service.getSite();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#222222' }}>
      {state.loading ? (
        <ActivityIndicator />
      ) : (
        <ScrollView>
          <PostListing
            post={state.post}
            moderators={state.moderators}
            admins={state.admins}
            enableDownvotes={state.siteRes.site.enable_downvotes}
            enableNsfw={state.siteRes.site.enable_nsfw}
          />
          {commentsTree()}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Post;
