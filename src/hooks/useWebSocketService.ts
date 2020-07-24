import React from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import { Observable } from "rxjs";
import { share } from "rxjs/operators";
import {
  UserJoinForm,
  UserOperation,
  LoginForm,
  RegisterForm,
  CommunityForm,
  FollowCommunityForm,
  ListCommunitiesForm,
  GetFollowedCommunitiesForm,
  PostForm,
  GetPostForm,
  GetCommunityForm,
  CommentForm,
  CommentLikeForm,
  SaveCommentForm,
  GetPostsForm,
  GetCommentsForm,
  CreatePostLikeForm,
  SavePostForm,
  BanFromCommunityForm,
  AddModToCommunityForm,
  TransferCommunityForm,
  TransferSiteForm,
  BanUserForm,
  AddAdminForm,
  GetUserDetailsForm,
  GetRepliesForm,
  GetUserMentionsForm,
  EditUserMentionForm,
  GetModlogForm,
  SiteForm,
  GetSiteConfig,
  SearchForm,
  UserSettingsForm,
  DeleteAccountForm,
  PasswordResetForm,
  PasswordChangeForm,
  PrivateMessageForm,
  EditPrivateMessageForm,
  GetPrivateMessagesForm,
  SiteConfigForm,
  MessageType,
  WebSocketJsonResponse,
} from "../interfaces";
import { SitesContext } from "../contexts/SitesContext";
import { AuthContext } from "../contexts/AuthContext";

function useWebSocketService() {
  const [firstConnect, setFirstConnect] = React.useState(true);
  const { activeSite, loading } = React.useContext(SitesContext);
  const { jwt } = React.useContext(AuthContext);

  if (!activeSite) return undefined;

  const ws = React.useMemo(() => new ReconnectingWebSocket(activeSite.wsUri), [
    activeSite.wsUri,
  ]);

  const wsSendWrapper = (op: UserOperation, data: MessageType) => {
    let send = { op: UserOperation[op], data };
    console.log(send);
    return JSON.stringify(send);
  };

  const setAuth = (obj: any, throwErr: boolean = true) => {
    if (!jwt && !loading && throwErr) {
      throw "Not logged in";
    }
    obj.auth = jwt;
  };

  const subject: Observable<any> = React.useMemo(
    () =>
      Observable.create((obs: any) => {
        ws.onmessage = (e) => {
          obs.next(JSON.parse(e.data));
        };
        ws.onopen = () => {
          console.log(`Connected to ${activeSite.wsUri}`);

          if (!loading && jwt) {
            WebSocketService.userJoin();
          }

          if (!firstConnect) {
            let res: WebSocketJsonResponse = {
              reconnect: true,
            };
            obs.next(res);
          }

          setFirstConnect(false);
        };
      }).pipe(share()),
    [ws, activeSite.wsUri, loading, jwt, firstConnect]
  );

  const WebSocketService = {
    subject,
    userJoin: () => {
      if (loading) return;
      if (!jwt) throw new Error("");
      let form: UserJoinForm = { auth: jwt };
      ws.send(wsSendWrapper(UserOperation.UserJoin, form));
    },

    login: (loginForm: LoginForm) => {
      ws.send(wsSendWrapper(UserOperation.Login, loginForm));
    },

    register: (registerForm: RegisterForm) => {
      ws.send(wsSendWrapper(UserOperation.Register, registerForm));
    },

    createCommunity: (communityForm: CommunityForm) => {
      setAuth(communityForm);
      ws.send(wsSendWrapper(UserOperation.CreateCommunity, communityForm));
    },

    editCommunity: (communityForm: CommunityForm) => {
      setAuth(communityForm);
      ws.send(wsSendWrapper(UserOperation.EditCommunity, communityForm));
    },

    followCommunity: (followCommunityForm: FollowCommunityForm) => {
      setAuth(followCommunityForm);
      ws.send(
        wsSendWrapper(UserOperation.FollowCommunity, followCommunityForm)
      );
    },

    listCommunities: (form: ListCommunitiesForm) => {
      setAuth(form, false);
      ws.send(wsSendWrapper(UserOperation.ListCommunities, form));
    },

    getFollowedCommunities: () => {
      if (!jwt) throw new Error("Not authenticated");
      let form: GetFollowedCommunitiesForm = { auth: jwt };
      ws.send(wsSendWrapper(UserOperation.GetFollowedCommunities, form));
    },

    listCategories() {
      ws.send(wsSendWrapper(UserOperation.ListCategories, {}));
    },

    createPost: (postForm: PostForm) => {
      setAuth(postForm);
      ws.send(wsSendWrapper(UserOperation.CreatePost, postForm));
    },

    getPost: (form: GetPostForm) => {
      setAuth(form, false);
      ws.send(wsSendWrapper(UserOperation.GetPost, form));
    },

    getCommunity: (form: GetCommunityForm) => {
      setAuth(form, false);
      ws.send(wsSendWrapper(UserOperation.GetCommunity, form));
    },

    createComment: (commentForm: CommentForm) => {
      setAuth(commentForm);
      ws.send(wsSendWrapper(UserOperation.CreateComment, commentForm));
    },

    editComment: (commentForm: CommentForm) => {
      setAuth(commentForm);
      ws.send(wsSendWrapper(UserOperation.EditComment, commentForm));
    },

    likeComment: (form: CommentLikeForm) => {
      setAuth(form);
      ws.send(wsSendWrapper(UserOperation.CreateCommentLike, form));
    },

    saveComment: (form: SaveCommentForm) => {
      setAuth(form);
      ws.send(wsSendWrapper(UserOperation.SaveComment, form));
    },

    getPosts: (form: GetPostsForm) => {
      setAuth(form, false);
      ws.send(wsSendWrapper(UserOperation.GetPosts, form));
    },

    getComments: (form: GetCommentsForm) => {
      setAuth(form, false);
      ws.send(wsSendWrapper(UserOperation.GetComments, form));
    },

    likePost: (form: CreatePostLikeForm) => {
      setAuth(form);
      ws.send(wsSendWrapper(UserOperation.CreatePostLike, form));
    },

    editPost: (postForm: PostForm) => {
      setAuth(postForm);
      ws.send(wsSendWrapper(UserOperation.EditPost, postForm));
    },

    savePost: (form: SavePostForm) => {
      setAuth(form);
      ws.send(wsSendWrapper(UserOperation.SavePost, form));
    },

    banFromCommunity: (form: BanFromCommunityForm) => {
      setAuth(form);
      ws.send(wsSendWrapper(UserOperation.BanFromCommunity, form));
    },

    addModToCommunity: (form: AddModToCommunityForm) => {
      setAuth(form);
      ws.send(wsSendWrapper(UserOperation.AddModToCommunity, form));
    },

    transferCommunity: (form: TransferCommunityForm) => {
      setAuth(form);
      ws.send(wsSendWrapper(UserOperation.TransferCommunity, form));
    },

    transferSite: (form: TransferSiteForm) => {
      setAuth(form);
      ws.send(wsSendWrapper(UserOperation.TransferSite, form));
    },

    banUser: (form: BanUserForm) => {
      setAuth(form);
      ws.send(wsSendWrapper(UserOperation.BanUser, form));
    },

    addAdmin: (form: AddAdminForm) => {
      setAuth(form);
      ws.send(wsSendWrapper(UserOperation.AddAdmin, form));
    },

    getUserDetails: (form: GetUserDetailsForm) => {
      setAuth(form, false);
      ws.send(wsSendWrapper(UserOperation.GetUserDetails, form));
    },

    getReplies: (form: GetRepliesForm) => {
      setAuth(form);
      ws.send(wsSendWrapper(UserOperation.GetReplies, form));
    },

    getUserMentions: (form: GetUserMentionsForm) => {
      setAuth(form);
      ws.send(wsSendWrapper(UserOperation.GetUserMentions, form));
    },

    editUserMention: (form: EditUserMentionForm) => {
      setAuth(form);
      ws.send(wsSendWrapper(UserOperation.EditUserMention, form));
    },

    getModlog: (form: GetModlogForm) => {
      ws.send(wsSendWrapper(UserOperation.GetModlog, form));
    },

    createSite: (siteForm: SiteForm) => {
      setAuth(siteForm);
      ws.send(wsSendWrapper(UserOperation.CreateSite, siteForm));
    },

    editSite: (siteForm: SiteForm) => {
      setAuth(siteForm);
      ws.send(wsSendWrapper(UserOperation.EditSite, siteForm));
    },

    getSite: () => {
      ws.send(wsSendWrapper(UserOperation.GetSite, {}));
    },

    getSiteConfig: () => {
      let siteConfig: GetSiteConfig = {};
      setAuth(siteConfig);
      ws.send(wsSendWrapper(UserOperation.GetSiteConfig, siteConfig));
    },

    search: (form: SearchForm) => {
      setAuth(form, false);
      ws.send(wsSendWrapper(UserOperation.Search, form));
    },

    markAllAsRead: () => {
      let form = {};
      setAuth(form);
      ws.send(wsSendWrapper(UserOperation.MarkAllAsRead, form));
    },

    saveUserSettings: (userSettingsForm: UserSettingsForm) => {
      setAuth(userSettingsForm);
      ws.send(wsSendWrapper(UserOperation.SaveUserSettings, userSettingsForm));
    },

    deleteAccount: (form: DeleteAccountForm) => {
      setAuth(form);
      ws.send(wsSendWrapper(UserOperation.DeleteAccount, form));
    },

    passwordReset: (form: PasswordResetForm) => {
      ws.send(wsSendWrapper(UserOperation.PasswordReset, form));
    },

    passwordChange: (form: PasswordChangeForm) => {
      ws.send(wsSendWrapper(UserOperation.PasswordChange, form));
    },

    createPrivateMessage: (form: PrivateMessageForm) => {
      setAuth(form);
      ws.send(wsSendWrapper(UserOperation.CreatePrivateMessage, form));
    },

    editPrivateMessage: (form: EditPrivateMessageForm) => {
      setAuth(form);
      ws.send(wsSendWrapper(UserOperation.EditPrivateMessage, form));
    },

    getPrivateMessages: (form: GetPrivateMessagesForm) => {
      setAuth(form);
      ws.send(wsSendWrapper(UserOperation.GetPrivateMessages, form));
    },

    saveSiteConfig: (form: SiteConfigForm) => {
      setAuth(form);
      ws.send(wsSendWrapper(UserOperation.SaveSiteConfig, form));
    },
  };

  return WebSocketService;
}

export default useWebSocketService;
