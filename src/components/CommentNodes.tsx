import React from "react";
import { View } from "react-native";
import {
  CommentNode as CommentNodeI,
  CommunityUser,
  UserView,
  CommentSortType,
  SortType,
} from "../interfaces";
import { commentSort, commentSortSortType } from "../utils";
import CommentNode from "./CommentNode";

interface CommentNodesProps {
  nodes: Array<CommentNodeI>;
  moderators?: Array<CommunityUser>;
  admins?: Array<UserView>;
  postCreatorId?: number;
  noIndent?: boolean;
  viewOnly?: boolean;
  locked?: boolean;
  markable?: boolean;
  showContext?: boolean;
  showCommunity?: boolean;
  sort?: CommentSortType;
  sortType?: SortType;
  enableDownvotes: boolean;
}

const CommentNodes: React.FC<CommentNodesProps> = (props) => {
  const sorter = (): Array<CommentNodeI> => {
    if (props.sort !== undefined) {
      commentSort(props.nodes, props.sort);
    } else if (props.sortType !== undefined) {
      commentSortSortType(props.nodes, props.sortType);
    }

    return props.nodes;
  };
  return (
    <View>
      {sorter().map((node) => (
        <CommentNode
          key={node.comment.id}
          node={node}
          noIndent={props.noIndent}
          viewOnly={props.viewOnly}
          locked={props.locked}
          moderators={props.moderators}
          admins={props.admins}
          postCreatorId={props.postCreatorId}
          markable={props.markable}
          showContext={props.showContext}
          showCommunity={props.showCommunity}
          sort={props.sort}
          sortType={props.sortType}
          enableDownvotes={props.enableDownvotes}
        />
      ))}
    </View>
  );
};

export default CommentNodes;
