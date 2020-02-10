// pages/posts/post-detail/post-detail.js
var postsData = require('../../../data/posts_data.js');
Page({
  data: {
    isPlayingMusic: false
  },
  onLoad: function(options) {
    var postId = options.id;
    this.data.currentPostId = postId;
    var postData = postsData.postList[postId];
    // console.log('postData==', postData);
    this.setData({
      postData
    });

    var postsCollected = wx.getStorageSync('posts_collected');
    if (postsCollected) {
      var postCollected = postsCollected[postId];
      if (postCollected) {
        this.setData({
          collected: postCollected
        })
      }
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      console.log('postCollected==1', postsCollected)
      wx.setStorageSync('posts_collected', postsCollected);
    }

    var that = this;
    wx.onBackgroundAudioPlay(function(){
      that.setData({
        isPlayingMusic: true
      })
    })
    wx.onBackgroundAudioPause(function(){
      that.setData({
        isPlayingMusic: false
      })
    })
  },
  onCollectionTap: function(event) {
    // this.getPostsCollectedAsy();
    this.getPostsCollectedSyc();
  },
  getPostsCollectedAsy: function() {
    var that = this;
    wx.getStorage({
      key: "posts_collected",
      success: function(res) {
        var postsCollected = res.data;
        var postCollected = postsCollected[that.data.currentPostId];
        // 收藏变成未收藏，未收藏变成收藏
        postCollected = !postCollected;
        postsCollected[that.data.currentPostId] = postCollected;
        that.showToast(postsCollected, postCollected);
      }
    })
  },
  getPostsCollectedSyc: function() {
    var postsCollected = wx.getStorageSync('posts_collected');
    console.log('postCollected==0', postsCollected)
    console.log('this.data.currentPostId=', this.data.currentPostId)
    var postCollected = postsCollected[this.data.currentPostId];
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    console.log('postCollected==', postCollected)
    this.showToast(postsCollected, postCollected)
  },
  showModal: function(postsCollected, postCollected) {
    var that = this;
    wx.showModal({
      title: '收藏',
      content: postCollected ? '收藏该文章?' : '取消收藏该文章？',
      showCancel: 'true',
      cancelText: '取消',
      cancelColor: '#333',
      confirmText: '确认',
      confirmColor: '#405f80',
      success: function(res) {
        if (res.confirm) {
          // 更新文章是否收藏的缓存值
          wx.setStorageSync('posts_collected', postsCollected);
          // 更新数据绑定，从而实现切换图片
          that.setData({
            collected: postCollected
          })
        }
      }
    })
  },
  showToast: function(postsCollected, postCollected) {
    // 更新文章是否收藏的缓存值
    wx.setStorageSync('posts_collected', postsCollected);
    // 更新数据绑定，从而实现切换图片
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? '收藏成功' : '取消收藏',
      duration: 1000,
      icon: 'success'
    })
  },
  onShareTap: function(event) {
    wx.showActionSheet({
      itemList: ['分享给为微信好友', '分享到朋友圈', '分享到QQ', '分享到微博'],
      itemColor: '#405f80',
      success: function(res) {
        // res.cancel 用户是不是点击了取消按钮
        // res.tapIndex 数组元素的序号，从0开始
      }
    })
  },
  onMusicTap: function(event) {
    var isPlayingMusic = this.data.isPlayingMusic;
    var currentPostId = this.data.currentPostId;
    var postData = postsData.postList[currentPostId];
    console.log('isPlayingMusic=', isPlayingMusic)
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio()  ;
      this.setData({
        isPlayingMusic: false
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg
      });
      this.setData({
        isPlayingMusic: true
      });
    }


  }
})