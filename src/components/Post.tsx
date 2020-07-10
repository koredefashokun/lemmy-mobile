import React from "react";
import { View } from "react-native";
import {
  Post as PostI,
  CommentSortType,
  Community,
  CommunityUser,
  GetSiteResponse,
} from "../interfaces";

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

const Post = () => {
  const [state, setState] = React.useReducer(
    (p: any, n: any) => ({ ...p, ...n }),
    initialState
  );
  return <View></View>;
};

export default Post;
