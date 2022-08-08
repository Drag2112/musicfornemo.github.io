const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "F8_PLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: {},
  // (1/2) Uncomment the line below to use localStorage
  // config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "BANG BANG BANG",
      singer: "BIGBANG",
      path: "https://tainhacmienphi.biz/get/song/api/16445",
      image:
        "https://scontent.fhan14-1.fna.fbcdn.net/v/t39.30808-6/296161248_1526230561164752_3690218425823645576_n.jpg?stp=cp1_dst-jpg&_nc_cat=104&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=Qr4EZMATOD0AX__8-OH&_nc_ht=scontent.fhan14-1.fna&oh=00_AT8QP_mz8bvHPJ9rjrGYuLmjYLzmFS9_rwOSsbsDJGK_sA&oe=62F68B1E"
    },
    {
      name: "LET'S NOT FALL IN LOVE",
      singer: "BIGBANG",
      path:
        "https://tainhacmienphi.biz/get/song/api/49772",
      image: "https://scontent.fhan14-1.fna.fbcdn.net/v/t1.6435-9/121495784_1075452312909248_7932438301718097357_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=174925&_nc_ohc=3RfkBU8GNdQAX_S8kIo&_nc_ht=scontent.fhan14-1.fna&oh=00_AT-_BrotGavtDaInxHERykbn1bHfySVSiTqmK7Ut46esGA&oe=6317A407"
    },
    {
      name: "SOBER",
      singer: "BIGBANG",
      path: "https://tainhacmienphi.biz/get/song/api/16181",
      image:
        "https://scontent.fhan14-2.fna.fbcdn.net/v/t1.6435-9/95978600_946797452441402_6935356298720444416_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=174925&_nc_ohc=zK3CtYxPmrYAX9Sbiuc&_nc_ht=scontent.fhan14-2.fna&oh=00_AT-QNVgk5dHukV42GRe3O3-kKIGbiph25upt4qlR6iAJeA&oe=6315CA08"
    },
    {
      name: "FANTASTIC BABY",
      singer: "BIGBANG",
      path: "https://tainhacmienphi.biz/get/song/api/9616",
      image:
        "https://scontent.fhan14-1.fna.fbcdn.net/v/t1.6435-9/130559620_1120159115105234_652751783785724913_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=AdtqvRyEksEAX-hsWYs&_nc_ht=scontent.fhan14-1.fna&oh=00_AT-LbD4tL5AUCJv0m3BoMEFwzj16tN8WVE0A8v0Ps9xHKA&oe=6315E523"
    },
    {
        name: "CROOKED",
        singer: "G-DRAGON",
        path: "https://tainhacmienphi.biz/get/song/api/58996",
        image:
          "https://scontent.fhan14-2.fna.fbcdn.net/v/t39.30808-6/272155475_1395313947589748_8691108494661041566_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=174925&_nc_ohc=rkK2Smi5rOgAX9gapYe&_nc_ht=scontent.fhan14-2.fna&oh=00_AT_V90C27twvu74W-IpqVGSlCS-sQZq4ZS4kyoV06uerTQ&oe=62F68083"
      },
    {
      name: "A BOY",
      singer: "G-DRAGON",
      path: "https://tainhacmienphi.biz/get/song/api/26025",
      image:
        "https://scontent.fhan14-1.fna.fbcdn.net/v/t39.30808-6/271173325_1380130422441434_2595732398867515141_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=8bfeb9&_nc_ohc=nPuHLO3HFckAX__sKL0&_nc_ht=scontent.fhan14-1.fna&oh=00_AT8dgIt78VWwpx9-ONfTFpybi2c2uWqvEBBjVSF75fSM4Q&oe=62F6BB66"
    }
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    // (2/2) Uncomment the line below to use localStorage
    // localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
                        <div class="song ${
                          index === this.currentIndex ? "active" : ""
                        }" data-index="${index}">
                            <div class="thumb"
                                style="background-image: url('${song.image}')">
                            </div>
                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                            <div class="option">
                                <i class="fas fa-ellipsis-h"></i>
                            </div>
                        </div>
                    `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {  //defineProperty định nghĩa currentSong sẽ là một method get ra 1 phần tử trong songs
      get: function () {
        return this.songs[this.currentIndex];
      }
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lý CD quay / dừng
    // Handle CD spins / stops
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, // 10 seconds
      iterations: Infinity
    });
    cdThumbAnimate.pause();

    // Xử lý phóng to / thu nhỏ CD
    // Handles CD enlargement / reduction
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0; //toán tử 2 ngôi (nếu newCdWidth > 0 thì lấy newCdWidth + "px" nếu không thì lấy 0)
      cd.style.opacity = newCdWidth / cdWidth; //vì opacity từ 0->1 => dùng kích thước mới / cũ => ra tỉ lệ < 0
    };

    // Xử lý khi click play
    // Handle when click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    //   player.classList.add("playing");
    };

    // Khi song được play
    // When the song is played
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // Khi song bị pause
    // When the song is pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // Khi tiến độ bài hát thay đổi
    // When the song progress changes
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // Xử lý khi tua song
    // Handling when seek
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Khi next song
    // When next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Khi prev song
    // When prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Xử lý bật / tắt random song
    // Handling on / off random song
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // Xử lý lặp lại một song
    // Single-parallel repeat processing
    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // Xử lý next song khi audio ended
    // Handle next song when audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Lắng nghe hành vi click vào playlist
    // Listen to playlist clicks
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");

      if (songNode || e.target.closest(".option")) {
        // Xử lý khi click vào song
        // Handle when clicking on the song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }

        // Xử lý khi click vào song option
        // Handle when clicking on the song option
        if (e.target.closest(".option")) {
        }
      }
    };
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }, 300);
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    // Gán cấu hình từ config vào ứng dụng
    // Assign configuration from config to application
    this.loadConfig();

    // Định nghĩa các thuộc tính cho object
    // Defines properties for the object
    this.defineProperties();

    // Lắng nghe / xử lý các sự kiện (DOM events)
    // Listening / handling events (DOM events)
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    // Load the first song information into the UI when running the app
    this.loadCurrentSong();

    // Render playlist
    this.render();

    // Hiển thị trạng thái ban đầu của button repeat & random
    // Display the initial state of the repeat & random button
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  }
};

app.start();