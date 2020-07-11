import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
} from '../interfaces';
import { colorList } from '../utils';
import { i18n } from '../i18next';
import moment from 'moment';
import Markdown from 'react-native-markdown-display';
import CommentNodes from './CommentNodes';

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

  const commentUnlessRemoved = React.useMemo(
    () =>
      node.comment.removed
        ? `*${i18n.t('removed')}*`
        : node.comment.deleted
        ? `*${i18n.t('deleted')}*`
        : node.comment.content,
    [node.comment]
  );

  return (
    <View
      style={[
        node.comment.parent_id && !props.noIndent ? { marginLeft: 4 } : {},
        { marginHorizontal: 8 },
      ]}
    >
      <View
        style={[
          !props.noIndent && props.node.comment.parent_id
            ? {
                borderLeftWidth: 1,
                borderLeftColor: state.borderColor,
                marginLeft: 8,
              }
            : {},
          { paddingVertical: 4 },
        ]}
      >
        <View
          style={
            !props.noIndent && props.node.comment.parent_id
              ? { marginLeft: 8 }
              : {}
          }
        >
          <View>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{ fontWeight: '500', marginRight: 5, color: '#999' }}
              >
                {node.comment.creator_name}
              </Text>
              <Text style={{ color: '#999' }}>•</Text>
              <Text style={{ fontWeight: '500', marginLeft: 5, color: '#999' }}>
                {moment.utc(node.comment.published).fromNow()}
              </Text>
            </View>
            <Markdown
              style={{
                body: { color: '#DEDEDE', fontSize: 15 },
                heading1: { fontWeight: '600' },
                heading2: { fontWeight: '600' },
                heading3: { fontWeight: '600' },
                heading4: { fontWeight: '600' },
                heading5: { fontWeight: '600' },
                heading6: { fontWeight: '600' },
              }}
            >
              {commentUnlessRemoved}
            </Markdown>
            {props.showCommunity && (
              <>
                <Text>{i18n.t('to')}</Text>
                <TouchableOpacity></TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
      {node.children && (
        <CommentNodes
          nodes={node.children}
          locked={props.locked}
          moderators={props.moderators}
          admins={props.admins}
          postCreatorId={props.postCreatorId}
          sort={props.sort}
          sortType={props.sortType}
          enableDownvotes={props.enableDownvotes}
        />
      )}
    </View>
  );
};

export default CommentNode;
