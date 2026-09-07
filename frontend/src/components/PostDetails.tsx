import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { setLoader } from "../redux/sliceLoader";
import { setMessageBar } from "../redux/sliceMessageBar";
import { useAppDispatch, useAppSelector } from '../redux/hookStore';

import { urlGetPost, urlAllComment, urlPostLike, urlComment } from "../api/APIs";
import { getRequest, putRequest, postRequest, deleteRequest } from "../api/APIManager";

import { motion } from "framer-motion";
import { X, Heart, MessageCircle, Download, Share2, Trash } from "lucide-react";

import GetMessage from "../utils/MessagesManager";
import ColorManager from "../utils/ColorManager";

import { routeFeed } from "../utils/Routes";
import Alert from "./Alert";
import type { Post } from "../models/modelPosts";
import type { AllComment } from "../models/modelComment";
import ProfilePlaceholder from "../assets/images/ProfilePlaceholder.png";

function PostDetails() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { postId } = useParams();

  const user = useAppSelector((state) => state.user);
  const { isLoading } = useAppSelector((state) => state.loader);

  const [post, setPost] = useState<Post | null>(null);

  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  const [isCommented, setIsCommented] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentInput, setCommentInput] = useState<string>("");
  const [comments, setComments] = useState<AllComment[]>([]);

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [deleteCallback, setDeleteCallback] = useState<() => void>(() => () => { });

  function isAuthenticated() {
    if (!user || !user.username) return false;
    return true;
  }

  function CopyLink(post: Post) {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(postUrl)
      .then(() => {
        ShowMsg(GetMessage("postLinkCopy"), ColorManager.msgInfo);
      })
      .catch((err) => {
        ShowMsg(GetMessage("postLinkCopyFail"), ColorManager.msgError);
        console.log("Error while copyLink:", err);
      });
  }

  function ShowMsg(message: string, color: string) {
    dispatch(setMessageBar({ message, color }));
  };

  function handleDeleteComment(comment: AllComment) {
    setDeleteCallback(() => () => DeleteComment(comment));
    setShowAlert(true);
  }

  async function GetPost() {
    dispatch(setLoader({ isLoading: true }));

    let url = `${urlGetPost}?postId=${postId}`;
    if (isAuthenticated()) url += `&userId=${user.id}`;
    const { data, error } = await getRequest<Post>(url);

    if (error || !data) {
      dispatch(setLoader({ isLoading: false }));
      return;
    }

    const postData = data as Post;

    setPost(postData);
    setIsLiked(postData.isLiked);
    setLikes(Array.isArray(postData.likes) ? postData.likes.length : postData.likes);
    dispatch(setLoader({ isLoading: false }));
  }

  async function GetComments() {

    setIsLoadingComments(true);

    const url = `${urlAllComment}?postId=${postId}`;
    const { data, error } = await getRequest<AllComment[]>(url);

    setIsLoadingComments(false);

    if (error || !data) {
      dispatch(setLoader({ isLoading: false }));
      return;
    }

    const commentsData = data as AllComment[];
    setComments(commentsData);
  }

  async function DownloadMedia(post: Post) {
    try {
      const response = await fetch(post.media_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `post-${post.id}.${blob.type.split("/")[1] || "jpg"}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      ShowMsg(GetMessage('imageDownloadSuccess'), ColorManager.msgSuccess);
    } catch (err) {
      ShowMsg(GetMessage('imageDownloadFail'), ColorManager.msgError);
    }
  }

  async function LikePost() {
    if (!post) return;

    if (!isAuthenticated()) {
      ShowMsg(GetMessage("loginToLike"), ColorManager.msgWarning);
      return;
    }

    const oldLiked = isLiked;
    const oldLikes = likes;
    setIsLiked(!oldLiked);
    setLikes(oldLiked ? oldLikes - 1 : oldLikes + 1);

    const { error } = await putRequest(`${urlPostLike}?id=${post.id}`);

    if (!error) return;

    setIsLiked(oldLiked);
    setLikes(oldLikes);
  }

  async function AddComment() {
    if (!post) return;

    if (!isAuthenticated()) {
      ShowMsg(GetMessage("loginToComment"), ColorManager.msgWarning);
      return;
    }

    const commentInputValue = commentInput.trim();

    if (commentInput.length < 1) {
      ShowMsg(GetMessage('commentLess'), ColorManager.msgError);
      return;
    }

    if (commentInput.length > 1000) {
      ShowMsg(GetMessage('commentMore'), ColorManager.msgError);
      return;
    }

    const newComment: AllComment = {
      id: -Date.now(),
      comment: commentInputValue,
      username: user.username,
      userId: user.id,
      created_at: new Date().toISOString(),
    }

    setCommentInput('');
    setComments(prev => [newComment, ...prev]);
    ShowMsg(GetMessage("commentAdded"), ColorManager.msgSuccess);

    const { data, error } = await postRequest<string>(urlComment, {
      postId,
      comment: commentInputValue,
      created_at: new Date().toISOString()
    });

    if (!data || error) {
      ShowMsg(error, ColorManager.msgError);
      setComments(prev => prev.filter(comment => comment.id !== newComment.id));
    }
  }

  async function DeleteComment(comment: AllComment) {
    if (!isAuthenticated()) return;

    const oldComments = comments;

    setComments(prev => prev.filter(c => c.id !== comment.id));
    ShowMsg(GetMessage("commentDeleted"), ColorManager.msgSuccess);

    const { error } = await deleteRequest<string>(`${urlComment}?id=${comment.id}`);

    if (error) {
      setComments(oldComments);
      ShowMsg(error, ColorManager.msgError);
    }
  }

  const createdDate = useMemo(() => {
    if (!post) return "";
    return new Date(post.created_at).toLocaleDateString();
  }, [post]);

  useEffect(() => {
    GetPost();
    GetComments();
  }, [postId]);

  useEffect(() => {
    if (!isAuthenticated()) return;
    const hasCommented = comments.some((comment) => comment.userId == user.id);
    setIsCommented(hasCommented);
  }, [user, comments]);

  function UINoPost() {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="fixedinset-0px-4flexitems-centerjustify-center">

          <motion.div
            initial={{ opacity: 0, scale: .8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md p-8 text-center text-white"
          >
            <h2 className=" text-2xl font-bold mb-4">
              Post vanished 👻
            </h2>

            <p className=" text-sm text-gray-400">
              This post might have been
              deleted or moved to another
              dimension.
            </p>

            <button
              onClick={() => navigate(routeFeed)}
              className="mt-6 px-5 py-3 rounded-xl bg-cyan-500"
            >
              Go Back
            </button>

          </motion.div>

        </div>
      </div>
    );
  }

  function UIComments() {
    return (
      <>
        <div className="mt-10">

          <h2 className="text-xl font-semibold mb-5">
            💬 Comments ({comments.length})
          </h2>

          {/* Add Comment */}
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="flex-1 px-3 py-2 text-sm bg-black/30 rounded-lg border border-white/20 text-white placeholder-white/50 outline-none"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={AddComment}
              className="px-4 py-2 bg-cyan-500 text-white text-sm font-semibold rounded-lg hover:bg-cyan-600 transition"
            >
              Comment
            </motion.button>
          </div>

          <div
            className="rounded-3xl border border-white/10 bg-black/20 backdrop-blur-md p-4 space-y-4"
          >
            {isLoadingComments ?
              (
                <div className="text-center text-white/50">
                  Loading comments...
                </div>
              ) : comments.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-10 text-center"
                >

                  <div className="text-4xl mb-3">💭</div>
                  <p className="text-white/50">No comments yet</p>
                </motion.div>
              ) : (
                comments.map(comment => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl border border-white/10 bg-white/[0.03]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium text-sm">{comment.username}</div>
                      <div className="text-xs text-white/40">{new Date(comment.created_at).toLocaleDateString()}</div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="mt-3 text-sm text-white/80 whitespace-pre-wrap break-words">{comment.comment}</div>

                      {isAuthenticated() && (comment.userId == user.id) && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteComment(comment)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash size={16} />
                        </motion.button>
                      )}

                    </div>
                  </motion.div>
                ))
              )}

          </div>
        </div>
      </>
    )
  }

  if (isLoading) return null;
  if (!post) return <UINoPost />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 overflow-y-auto custom-scroll text-white px-3 sm:px-5 py-5 z-50"
    >

      {/* Close */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: .95 }}
        onClick={() => navigate(routeFeed)}
        className="fixed top-5 right-5 z-50 p-3 rounded-full border border-white/10 bg-black/40 backdrop-blur-md hover:bg-black/60"
      >
        <X size={20} />
      </motion.button>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-6xl mx-auto rounded-3xl border border-white/10 bg-black/25 backdrop-blur-md shadow-2xl p-5 sm:p-8"
      >

        {/* HEADER */}
        <div className="flex justify-between items-start gap-4 pb-5 border-b border-white/10">

          <h1 className="text-2xl sm:text-4xl font-bold leading-tight break-words flex-1">
            {post.post_title}
          </h1>

          <div className="text-xs text-white/50 whitespace-nowrap pt-1">
            {createdDate}
          </div>

        </div>

        {/* USER */}
        <div className="flex items-center gap-3 mt-5">

          <div className="w-11 h-11 rounded-full overflow-hidden border border-white/20 shrink-0">
            <img
              src={post.user_image_url || ProfilePlaceholder}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="font-medium text-base">
            {post.username || "Unknown User"}
          </div>

        </div>

        {/* MEDIA */}
        {post.media_url && (

          <div className="mt-6 relative rounded-3xl overflow-hidden bg-black/40 border border-white/10">

            <div className="flex justify-center items-center max-h-[70vh] p-2">
              <img
                src={post.media_url}
                className="max-w-full max-h-[70vh] w-auto h-auto object-contain rounded-2xl"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: .9 }}
              onClick={() => DownloadMedia(post)}
              className="absolute bottom-4 right-4 p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10 hover:bg-black/70 text-white"
            >
              <Download size={18} />
            </motion.button>

          </div>

        )}

        {/* BODY */}
        <div className="mt-7 text-[15px] sm:text-base leading-8 text-white/90 whitespace-pre-wrap break-words">
          {post.post_body}
        </div>

        {/* STATS */}
        <div className="mt-7 flex justify-between items-center flex-wrap gap-4 border-y border-white/10 py-4">
          <div className="flex gap-6">

            <motion.button
              onClick={LikePost}
              whileTap={{ scale: 1.2 }}
              whileHover={{ scale: .95 }}
              className={`flex items-center gap-2 transition-all cursor-pointer
              ${isLiked ? "text-red-500" : "text-white/80 hover:text-red-400"}`}
            >
              {/* ${isLiked ? "text-red-500" : isAuthenticated() ? "text-white/80 hover:text-red-400" : "text-white/30 cursor-default"}`} */}

              <Heart
                size={18}
                className={`transition-all ${isLiked ? "fill-red-500" : "fill-transparent"}`}
              />

              <span>{likes}</span>

            </motion.button>

            <motion.div className={`flex items-center gap-1 transition-colors duration-200 ${isCommented ? 'text-cyan-500' : 'hover:text-cyan-400'}`}
              whileTap={{ scale: 1.2 }}
              whileHover={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}>
              <MessageCircle className={`w-4 h-4 transition-all duration-200 ${isCommented ? "fill-cyan-500" : "fill-transparent"}`} /> <span>{comments.length ?? 0}</span>
            </motion.div>

            <motion.button className={`flex items-center gap-1 transition-colors duration-200 hover:text-orange-400`}
              onClick={() => CopyLink(post)}
              whileTap={{ scale: 1.2 }}
              whileHover={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}>
              <Share2 className={`w-4 h-4 transition-all duration-200 fill-transparent`} />
            </motion.button>

          </div>

          <div className="px-4 py-1.5 rounded-full text-sm bg-cyan-500/10 text-cyan-400">
            {post.category}
          </div>
        </div>

        {UIComments()}

      </motion.div>

      <Alert
        isOpen={showAlert}
        message="Are you sure you want to delete this comment?"
        onClose={() => setShowAlert(false)}
        onConfirm={deleteCallback}
      />

    </motion.div>
  );
}

export default React.memo(PostDetails);