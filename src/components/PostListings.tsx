import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Post } from "../interfaces";
import { postSort } from "../utils";
import { View, Text } from "react-native";
import { i18n } from "../i18next";
import PostListing from "./PostListing";

const PostListings = (props) => {
  const outer = (): Array<Post> => {
    let out = props.posts;
    if (props.removeDuplicates) {
      out = removeDuplicates(out);
    }

    if (props.sort !== undefined) {
      postSort(out, props.sort, props.showCommunity == undefined);
    }

    return out;
  };

  const removeDuplicates = (posts: Array<Post>): Array<Post> => {
    // A map from post url to list of posts (dupes)
    let urlMap = new Map<string, Array<Post>>();

    // Loop over the posts, find ones with same urls
    for (let post of posts) {
      if (
        post.url &&
        !post.deleted &&
        !post.removed &&
        !post.community_deleted &&
        !post.community_removed
      ) {
        if (!urlMap.get(post.url)) {
          urlMap.set(post.url, [post]);
        } else {
          urlMap.get(post.url)?.push(post);
        }
      }
    }

    // Sort by oldest
    // Remove the ones that have no length
    for (let e of urlMap.entries()) {
      if (e[1].length == 1) {
        urlMap.delete(e[0]);
      } else {
        e[1].sort((a, b) => a.published.localeCompare(b.published));
      }
    }

    for (let i = 0; i < posts.length; i++) {
      let post = posts[i];
      if (post.url) {
        let found = urlMap.get(post.url);
        if (found) {
          // If its the oldest, add
          if (post.id == found[0].id) {
            post.duplicates = found.slice(1);
          }
          // Otherwise, delete it
          else {
            posts.splice(i--, 1);
          }
        }
      }
    }

    return posts;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#222222" }}>
      {props.posts.length > 0 ? (
        outer().map((post) => (
          <>
            <PostListing
              key={post.id}
              post={post}
              showCommunity={props.showCommunity}
              enableDownvotes={props.enableDownvotes}
              enableNsfw={props.enableNsfw}
            />
          </>
        ))
      ) : (
        <>
          <Text>{i18n.t("no_posts")}</Text>
          {props.showCommunity !== undefined && (
            // <T i18nKey="subscribe_to_communities">
            //   #<Link to="/communities">#</Link>
            // </T>
            <View />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default PostListings;
