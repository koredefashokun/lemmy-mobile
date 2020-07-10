import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import { Post, CommunityUser, UserView, BanType } from '../interfaces';
import { getMomentLanguage } from '../utils';
// import { colors } from '../styles/theme';
import { useNavigation } from '@react-navigation/native';

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
    removeReason: null,
    showBanDialog: false,
    banReason: null,
    banExpires: null,
    banType: BanType.Community,
    showConfirmTransferSite: false,
    showConfirmTransferCommunity: false,
    imageExpanded: false,
    viewSource: false,
    showAdvanced: false,
    my_vote: props.post.my_vote,
    score: props.post.score,
    upvotes: props.post.upvotes,
    downvotes: props.post.downvotes,
  };

  const [state, setState] = React.useReducer(
    (p: any, n: any) => ({ ...p, ...n }),
    initialState
  );

  React.useEffect(() => {
    const lang = getMomentLanguage();
    moment.locale(lang);
  }, []);

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
            color: '#DEDEDE',
          }}
        >
          {props.post.name}
        </Text>
        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather
              name='arrow-up'
              color='#999'
              size={20}
              style={{ marginRight: 5 }}
            />
            <Text style={{ fontSize: 16, fontWeight: '500', color: '#999' }}>
              {state.score}
            </Text>
            <Feather
              name='arrow-down'
              color='#999'
              size={20}
              style={{ marginLeft: 5 }}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PostListing;
