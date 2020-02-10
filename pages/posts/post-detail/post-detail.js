// pages/posts/post-detail/post-detail.js
var postsData = require('../../../data/posts_data.js');
Page({

  onLoad: function (options) {
    var postId = options.id;
    this.data.currentPostId = postId;
    var postData = postsData.postList[postId];
    // console.log('postData==', postData);
    this.setData({postData});
    
    var postsCollected = wx.getStorageSync('posts_collected');
    if(postsCollected){
      var postCollected = postsCollected[postId];
      if(postCollected){
        this.setData({
          collected: postCollected
        })
      }
    }else{
      var postsCollected = {};
      postsCollected[postId] = false;
      console.log('postCollected==1', postsCollected)
      wx.setStorageSync('posts_collected', postsCollected);
    }
  },
  onCollectionTap:function(event) {
    var postsCollected = wx.getStorageSync('posts_collected');
    console.log('postCollected==0', postsCollected)
    console.log('this.data.currentPostId=', this.data.currentPostId)
    var postCollected = postsCollected[this.data.currentPostId];
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    console.log('postCollected==', postCollected)
    // 更新文章是否收藏的缓存值
    wx.setStorageSync('posts_collected', postsCollected);
    // 更新数据绑定，从而实现切换图片
    this.setData({
      collected: postsCollected
    })
  }
})