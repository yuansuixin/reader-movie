// pages/movies/movies.js
var util = require('../../utils/util.js');
var app = getApp();

Page({
  data:{
    //异步请求绑定对象的时候需要有初始值，否则找不到
    inTheaters:{},
    comingSoon:{},
    top250:{}
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var baseUrl = app.globalData.doubanBase;
    var inTheatersUrl = '/v2/movie/in_theaters'+"?start=0&count=3";
    var comingSoonUrl = '/v2/movie/coming_soon' + "?start=0&count=3";
    var top250Url = '/v2/movie/top250' + "?start=0&count=3";

    this.getMovieListData(baseUrl + inTheatersUrl, "inTheaters", '正在热映');
    this.getMovieListData(baseUrl + comingSoonUrl,'comingSoon','即将上映');
    this.getMovieListData(baseUrl + top250Url,'top250','豆瓣Top250');

  },
  onMoreTap:function(event){
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category='+category,
    })
  },
  getMovieListData: function (url, settedKey, cagetoryTitle){
    var that = this;
    // 是异步调用
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": 'application/json'
      },
      success: function (res) {
        console.log(res)
        that.processDoubanData(res.data, settedKey, cagetoryTitle);
      }
    })
  },
  processDoubanData: function (moviesDouban, settedKey,cagetoryTitle){
    var movies = [];
    for(var idx in moviesDouban.subjects){
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if(title.length>=6){
        title = title.substring(0,6) + '...';
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title,
        average:subject.rating.average,
        coverageUrl: subject.images.large,
        movieId:subject.id
      }
      console.log('temp===',temp)
      console.log(subject.rating.stars)
      movies.push(temp)
    }
    console.log('movies==', movies)
    //动态属性
    var readyData = {};
    readyData[settedKey] = { movies, cagetoryTitle};
    this.setData(readyData);
  }
})