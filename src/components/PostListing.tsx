import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import {
  Post,
  CommunityUser,
  UserView,
  BanType,
  CreatePostLikeForm
} from '../interfaces';
import { getMomentLanguage } from '../utils';
import { colors } from '../styles/theme';
import useWebSocketService from '../hooks/useWebSocketService';
import { SitesContext } from '../contexts/SitesContext';

interface PostListingState {
  showEdit: boolean;
  showRemoveDialog: boolean;
  removeReason: string;
  showBanDialog: boolean;
  banReason: string;
  banExpires: string;
  banType: BanType;
  showConfirmTransferSite: boolean;
  showConfirmTransferCommunity: boolean;
  imageExpanded: boolean;
  viewSource: boolean;
  showAdvanced: boolean;
  my_vote: number;
  score: number;
  upvotes: number;
  downvotes: number;
}

interface PostListingProps {
  post: Post;
  showCommunity?: boolean;
  showBody?: boolean;
  moderators?: Array<CommunityUser>;
  admins?: Array<UserView>;
  enableDownvotes: boolean;
  enableNsfw: boolean;
}

const PostListing: React.FC<PostListingProps> = (props) => {
  const { navigate } = useNavigation();

  const initialState: PostListingState = {
    showEdit: false,
    showRemoveDialog: false,
    removeReason: null as any,
    showBanDialog: false,
    banReason: null as any,
    banExpires: null as any,
    banType: BanType.Community,
    showConfirmTransferSite: false,
    showConfirmTransferCommunity: false,
    imageExpanded: false,
    viewSource: false,
    showAdvanced: false,
    my_vote: props.post.my_vote as any,
    score: props.post.score,
    upvotes: props.post.upvotes,
    downvotes: props.post.downvotes
  };

  // TODO: Implement upvote/downvote logic.
  const [state, setState] = React.useReducer(
    (p: any, n: any) => ({ ...p, ...n }),
    initialState
  );

  const { activeSite, loading } = React.useContext(SitesContext);
  const service = useWebSocketService({ activeSite, loading });

  React.useEffect(() => {
    const lang = getMomentLanguage();
    moment.locale(lang);
  }, []);

  const handlePostLike = () => {
    // TODO: Make sure that the user is authenticated first.
    // Avoid mutating state (anti-pattern).

    // if (!UserService.Instance.user) {
    // this.context.router.history.push(`/login`);
    // }

    const new_vote = state.my_vote == 1 ? 0 : 1;

    if (state.my_vote == 1) {
      state.score--;
      state.upvotes--;
    } else if (state.my_vote == -1) {
      state.downvotes--;
      state.upvotes++;
      state.score += 2;
    } else {
      state.upvotes++;
      state.score++;
    }

    state.my_vote = new_vote;

    let form: CreatePostLikeForm = {
      post_id: props.post.id,
      score: state.my_vote
    };

    service?.likePost(form);
    setState(state);
    // setupTippy();
  };

  const handlePostDislike = () => {
    // TODO: Make sure the user is authenticated first.
    // Avoid mutating state.

    // if (!UserService.Instance.user) {
    //   this.context.router.history.push(`/login`);
    // }

    const new_vote = state.my_vote == -1 ? 0 : -1;

    if (state.my_vote == 1) {
      state.score -= 2;
      state.upvotes--;
      state.downvotes++;
    } else if (state.my_vote == -1) {
      state.downvotes--;
      state.score++;
    } else {
      state.downvotes++;
      state.score--;
    }

    state.my_vote = new_vote;

    let form: CreatePostLikeForm = {
      post_id: props.post.id,
      score: state.my_vote
    };

    service?.likePost(form);
    setState(state);
    // setupTippy();
  };

  // Remove wrapping TouchableOpacity to make upvote/downvote buttons clickable
  return (
    <TouchableOpacity
      onPress={() => navigate('Post', { postId: props.post.id })}
      activeOpacity={0.8}
      style={{ marginVertical: 5, paddingTop: 8, paddingHorizontal: 8 }}
    >
      <View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ fontWeight: '500', marginRight: 5, color: '#999' }}>
            {props.post.creator_name} in {props.post.community_name}
          </Text>
          <Text style={{ color: '#999' }}>•</Text>
          <Text style={{ fontWeight: '500', marginLeft: 5, color: '#999' }}>
            {moment.utc(props.post.published).fromNow()}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '500',
            marginTop: 5,
            color: '#DEDEDE'
          }}
        >
          {props.post.name}
        </Text>
        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              style={{ marginRight: 5 }}
              onPress={handlePostLike}
            >
              <Feather
                name='arrow-up'
                color={state.my_vote === 1 ? colors.info : '#999'}
                size={20}
              />
            </TouchableOpacity>
            <Text style={{ fontSize: 16, fontWeight: '500', color: '#999' }}>
              {state.score}
            </Text>
            <TouchableOpacity
              style={{ marginLeft: 5 }}
              onPress={handlePostDislike}
            >
              <Feather name='arrow-down' color='#999' size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PostListing;
