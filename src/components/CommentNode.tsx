import React from "react";
import { View, Text } from "react-native";
import {
  CommentNode as CommentNodeI,
  CommentLikeForm,
  CommentForm as CommentFormI,
  EditUserMentionForm,
  SaveCommentForm,
  BanFromCommunityForm,
  BanUserForm,
  CommunityUser,
  UserView,
  AddModToCommunityForm,
  AddAdminForm,
  TransferCommunityForm,
  TransferSiteForm,
  BanType,
  CommentSortType,
  SortType,
} from "../interfaces";
import { colorList } from "../utils";
import { i18n } from "../i18next";
import { TouchableOpacity } from "react-native-gesture-handler";

interface CommentNodeState {
  showReply: boolean;
  showEdit: boolean;
  showRemoveDialog: boolean;
  removeReason: string;
  showBanDialog: boolean;
  banReason: string;
  banExpires: string;
  banType: BanType;
  showConfirmTransferSite: boolean;
  showConfirmTransferCommunity: boolean;
  showConfirmAppointAsMod: boolean;
  showConfirmAppointAsAdmin: boolean;
  collapsed: boolean;
  viewSource: boolean;
  showAdvanced: boolean;
  my_vote: number;
  score: number;
  upvotes: number;
  downvotes: number;
  borderColor: string;
  readLoading: boolean;
  saveLoading: boolean;
}

interface CommentNodeProps {
  node: CommentNodeI;
  noIndent?: boolean;
  viewOnly?: boolean;
  locked?: boolean;
  markable?: boolean;
  showContext?: boolean;
  moderators: Array<CommunityUser> | undefined;
  admins: Array<UserView> | undefined;
  // TODO is this necessary, can't I get it from the node itself?
  postCreatorId?: number;
  showCommunity?: boolean;
  sort?: CommentSortType;
  sortType?: SortType;
  enableDownvotes: boolean;
}

const CommentNode: React.FC<CommentNodeProps> = (props) => {
  const initialState: CommentNodeState = {
    showReply: false,
    showEdit: false,
    showRemoveDialog: false,
    removeReason: null,
    showBanDialog: false,
    banReason: null,
    banExpires: null,
    banType: BanType.Community,
    collapsed: false,
    viewSource: false,
    showAdvanced: false,
    showConfirmTransferSite: false,
    showConfirmTransferCommunity: false,
    showConfirmAppointAsMod: false,
    showConfirmAppointAsAdmin: false,
    my_vote: props.node.comment.my_vote,
    score: props.node.comment.score,
    upvotes: props.node.comment.upvotes,
    downvotes: props.node.comment.downvotes,
    borderColor: props.node.comment.depth
      ? colorList[props.node.comment.depth % colorList.length]
      : colorList[0],
    readLoading: false,
    saveLoading: false,
  };
  const [state, setState] = React.useReducer(
    (p: any, n: any) => ({ ...p, ...n }),
    initialState
  );

  const { node } = props;

  return (
    <View>
      <View>
        <View>
          <View>
            {props.showCommunity && (
              <>
                <Text>{i18n.t("to")}</Text>
                <TouchableOpacity></TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default CommentNode;
