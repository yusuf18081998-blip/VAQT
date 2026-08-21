export type Language = 'uz' | 'en' | 'ru';

export interface Translations {
  appName: string;
  tagline: string;
  nav: {
    pomodoro: string;
    clock: string;
    stopwatch: string;
    countdown: string;
    worldClock: string;
    tasks: string;
    analytics: string;
    code: string;
    garden: string;
  };
  soundStatus: {
    muted: string;
    playing: string;
    on: string;
    muteTooltip: string;
    unmuteTooltip: string;
    clickToMute: string;
    clickToUnmute: string;
  };
  actions: {
    start: string;
    pause: string;
    resume: string;
    reset: string;
    skip: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    export: string;
    import: string;
    close: string;
    clear: string;
    installApp: string;
    enableNotifications: string;
    notificationsEnabled: string;
    mute: string;
    unmute: string;
    fullscreen: string;
    exitFullscreen: string;
    shortcuts: string;
    toggle3d: string;
  };
  pomodoro: {
    focus: string;
    shortBreak: string;
    longBreak: string;
    study: string;
    completedCycles: string;
    completedDesc: string;
    taskPlaceholder: string;
    digitalClockTab: string;
    treeLandTab: string;
    myGardenBtn: string;
    plantSpeciesLabel: string;
    treeGrowingOnPlot: string;
    settingsHeader: string;
    focusTimeLabel: string;
    shortBreakTimeLabel: string;
    longBreakTimeLabel: string;
    sessionsCountLabel: string;
    viewGardenBtn: string;
    tickSoundTooltip: string;
    settingsTooltip: string;
    clearConfirm: string;
    deepFocusMode: string;
    deepFocusDesc: string;
    autoBreak: string;
    soundAlarm: string;
    tickSound: string;
    plantTree: string;
    treeGrowing: string;
    treeAlive: string;
    treeWithered: string;
    sessionFinishedTitle: string;
    sessionFinishedBody: string;
    breakFinishedTitle: string;
    breakFinishedBody: string;
    taskGoalLabel: string;
    treeWitheredWarning: string;
    leftAppWarning: string;
    focusProtectionActive: string;
    treeGrowsDuringFocus: string;
    witheredStatus: string;
    maturedStatus: string;
  };
  garden: {
    title: string;
    subtitle: string;
    aliveCountBadge: string;
    view3D: string;
    viewGallery: string;
    aliveTreesStat: string;
    aliveTreesDesc: string;
    witheredStat: string;
    witheredDesc: string;
    focusTimeStat: string;
    focusTimeDesc: string;
    gardenYieldStat: string;
    gardenYieldDesc: string;
    landTypeLabel: string;
    waterBtn: string;
    wateringStatus: string;
    weatherTooltip: string;
    plantTreeBtn: string;
    landOccupiedBadge: string;
    emptyPlotLabel: string;
    emptySoil: string;
    emptyPlotTooltip: string;
    plotNumber: string;
    filterAll: string;
    filterAlive: string;
    filterWithered: string;
    noTreesTitle: string;
    noTreesDesc: string;
    ruleTitle: string;
    ruleDesc: string;
    clearHistoryBtn: string;
    clearConfirm: string;
    aliveMaturedTag: string;
    witheredTag: string;
    witheredTreeName: string;
    focusSessionDefault: string;
    minutesFocusTag: string;
    plantedAtLabel: string;
    biomes: {
      meadow: { name: string; description: string };
      autumn: { name: string; description: string };
      sakura: { name: string; description: string };
      cyber: { name: string; description: string };
      oasis: { name: string; description: string };
    };
  };
  speciesNames: Record<
    string,
    { name: string; desc: string; shortName: string }
  >;
  soundscapes: {
    title: string;
    binauralBeats: string;
    ambientSounds: string;
    gammaTitle: string;
    gammaDesc: string;
    betaTitle: string;
    betaDesc: string;
    alphaTitle: string;
    alphaDesc: string;
    thetaTitle: string;
    thetaDesc: string;
    rain: string;
    waves: string;
    forest: string;
    cafe: string;
    lofi: string;
    whiteNoise: string;
    pinkNoise: string;
    brownNoise: string;
    clockTick: string;
    volume: string;
    visualizerMode: string;
    wavesVisualizer: string;
    barsVisualizer: string;
    particlesVisualizer: string;
    ringVisualizer: string;
  };
  analytics: {
    title: string;
    subtitle: string;
    todayFocus: string;
    weeklyFocus: string;
    totalHours: string;
    completedPomodoros: string;
    treesPlanted: string;
    tasksCompleted: string;
    productivityScore: string;
    weeklyChartTitle: string;
    dailyDistribution: string;
    exportData: string;
    importData: string;
    exportCsv: string;
    exportJson: string;
    importSuccess: string;
    importError: string;
    clearHistory: string;
    historyCleared: string;
  };
  shortcuts: {
    title: string;
    space: string;
    rKey: string;
    mKey: string;
    fKey: string;
    dKey: string;
    tKey: string;
    lKey: string;
    hKey: string;
  };
  themes: {
    dark: string;
    light: string;
    cyber: string;
    forest: string;
    sunset: string;
    oled: string;
  };
  admin: {
    badge: string;
    title: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  uz: {
    appName: 'VAQT',
    tagline: 'Professional Pomodoro & Diqqat Studiyasi',
    nav: {
      pomodoro: 'Pomodoro',
      clock: 'Katta Soat',
      stopwatch: 'Sekundomer',
      countdown: 'Taymer',
      worldClock: 'Dunyo Soati',
      tasks: 'Vazifalar',
      analytics: 'Statistika & Grafiklar',
      code: 'Manba Kodi',
      garden: 'Bogʻ & Yerlar',
    },
    soundStatus: {
      muted: 'Ovoz: Oʻchiq',
      playing: 'Ovoz: Chalinmoqda',
      on: 'Ovoz: Yoqilgan',
      muteTooltip: 'Ovoz oʻchirilgan (Mute: M)',
      unmuteTooltip: 'Ovoz yoqilgan (Mute: M)',
      clickToUnmute: 'Ovoz oʻchirilgan (Yoqish uchun bosing yoki M)',
      clickToMute: 'Ovoz yoqilgan (Oʻchirish uchun bosing yoki M)',
    },
    actions: {
      start: 'Boshlash',
      pause: 'Toʻxtatish',
      resume: 'Davom ettirish',
      reset: 'Qayta oʻrnatish',
      skip: 'Oʻtkazib yuborish',
      save: 'Saqlash',
      cancel: 'Bekor qilish',
      delete: 'Oʻchirish',
      edit: 'Tahrirlash',
      export: 'Eksport (.json/.csv)',
      import: 'Import (Tiklash)',
      close: 'Yopish',
      clear: 'Tozalash',
      installApp: 'Ilovani Oʻrnatish (PWA)',
      enableNotifications: 'Bildirishnomalarni Yoqish',
      notificationsEnabled: 'Bildirishnomalar Yoqilgan',
      mute: 'Ovozni oʻchirish',
      unmute: 'Ovozni yoqish',
      fullscreen: 'Toʻliq ekran',
      exitFullscreen: 'Ekrandan chiqish',
      shortcuts: 'Tezkor tugmalar (Hotkeys)',
      toggle3d: '3D Rejimi',
    },
    pomodoro: {
      focus: 'Fokus Seansi',
      shortBreak: 'Qisqa Tanaffus',
      longBreak: 'Katta Tanaffus',
      study: 'Chuqur Oʻqish',
      completedCycles: 'Tugallangan sikllar',
      completedDesc: 'Bugungi kunda jami {mins} daqiqa chuqur fokus vaqti sarflandi • {trees} ta yerda daraxtlar unib chiqdi.',
      taskPlaceholder: 'Qaysi vazifa ustida ishlayapsiz? (Masalan: Algoritmlar & WebGL)',
      digitalClockTab: '⏱️ Raqamli Soat',
      treeLandTab: '🌱 Daraxt & Yer',
      myGardenBtn: 'Mening Bogʻim & Yerlarim',
      plantSpeciesLabel: 'Ekiladigan daraxt:',
      treeGrowingOnPlot: 'unmoqda',
      settingsHeader: 'Pomodoro Sozlamalari (Daqiqalarda)',
      focusTimeLabel: '🎯 Fokus (daq):',
      shortBreakTimeLabel: '☕ Qisqa (daq):',
      longBreakTimeLabel: '🌴 Katta (daq):',
      sessionsCountLabel: 'Sessiya',
      viewGardenBtn: 'Bogʻ & Yerlarni Koʻrish',
      tickSoundTooltip: 'Soat tiktagi ovozi (Tick-Tock)',
      settingsTooltip: 'Pomodoro Sozlamalari',
      clearConfirm: 'Fokus sessiyalari hisoblagichini tozalashni xohlaysizmi?',
      deepFocusMode: 'Chuqur Fokus & Tirik Oʻrmon',
      deepFocusDesc: 'Agar boshqa sahifaga oʻtsangiz, nihol quriydi!',
      autoBreak: 'Tanaffusni avto-boshlash',
      soundAlarm: 'Qoʻngʻiroq ovozi',
      tickSound: 'Tiktak ovozi',
      plantTree: 'Daraxt ekish',
      treeGrowing: 'Nihol oʻsmoqda...',
      treeAlive: 'Yashil daraxt muvaffaqiyatli yetildi!',
      treeWithered: 'Diqqat boʻlindi — daraxt quridi!',
      sessionFinishedTitle: '🎉 Fokus seansi yakunlandi!',
      sessionFinishedBody: 'Ajoyib natija! Endi qisqa dam olish vaqti keldi.',
      breakFinishedTitle: '⏰ Tanaffus tugadi!',
      breakFinishedBody: 'Kuch toʻpladingizmi? Yangi fokus seansiga tayyormisiz?',
      taskGoalLabel: '🎯 Dars maqsadi:',
      treeWitheredWarning: 'Daraxt quridi (Boshqa ilovaga chiqildi)',
      leftAppWarning: 'Diqqat! Ilovadan chiqdingiz ({count} marta)',
      focusProtectionActive: 'Fokus Himoyasi Faol',
      treeGrowsDuringFocus: 'Dars davomida daraxt unadi',
      witheredStatus: 'Quridi (0%)',
      maturedStatus: '{percent}% Yetildi',
    },
    garden: {
      title: 'Mening Bogʻim & Yer Maydonlarim',
      subtitle: 'Pomodoro fokus mashgʻulotlarida unib chiqqan jonli yer va daraxtlar',
      aliveCountBadge: '{count} ta tirik daraxt',
      view3D: '3D Yer Maydoni',
      viewGallery: 'Galereya',
      aliveTreesStat: 'Yashil Daraxtlar',
      aliveTreesDesc: 'Yetilgan hosildor daraxt',
      witheredStat: 'Qurigan Yerlar',
      witheredDesc: 'Dars buzilgan holatlar',
      focusTimeStat: 'Fokus Vaqti',
      focusTimeDesc: '{hours} soat toʻliq dars',
      gardenYieldStat: 'Bogʻ Hosildorligi',
      gardenYieldDesc: 'Fokus muvaffaqiyati',
      landTypeLabel: 'Yer Turi:',
      waterBtn: 'Sugʻorish',
      wateringStatus: 'Sugʻorilmoqda... 💧',
      weatherTooltip: 'Ob-havoni oʻzgartirish (Quyosh / Yomgʻir / Tun)',
      plantTreeBtn: 'Daraxt Ekish',
      landOccupiedBadge: 'Band yer maydoni',
      emptyPlotLabel: 'Boʻsh tuproq',
      emptySoil: 'Boʻsh tuproq',
      emptyPlotTooltip: 'Boʻsh unumdor yer: Yangi Pomodoro sessiyasini boshlab, bu yerga daraxt eking!',
      plotNumber: 'Yer #{index}',
      filterAll: 'Barchasi',
      filterAlive: 'Yashillar',
      filterWithered: 'Quriganlar',
      noTreesTitle: 'Hozircha daraxtlar yoʻq',
      noTreesDesc: 'Pomodoro dars taymerini boshlang va toʻliq oʻtiring. Sessiya yakunida bogʻingizda yangi daraxt qad koʻtaradi!',
      ruleTitle: 'Qoida:',
      ruleDesc: 'Har bir muvaffaqiyatli Pomodoro darsi bitta yangi yer maydonini yam-yashil daraxtga aylantiradi!',
      clearHistoryBtn: 'Tarixni tozalash',
      clearConfirm: 'Barcha ekilgan daraxtlar tarixini tozalashni xohlaysizmi?',
      aliveMaturedTag: 'Tirik & Yetilgan',
      witheredTag: 'Qurigan',
      witheredTreeName: 'Qurib qolgan daraxt',
      focusSessionDefault: 'Fokus mashgʻuloti',
      minutesFocusTag: '{mins} daqiqa toʻliq konsentratsiya',
      plantedAtLabel: 'Ekilgan vaqt:',
      biomes: {
        meadow: {
          name: 'Yashil Vodiy',
          description: 'Serhosil unumdor tuproq va yam-yashil maysazor',
        },
        autumn: {
          name: 'Oltin Kuz Bogʻi',
          description: 'Sariq va qizil xazonlar toʻshalgan sokin orolcha',
        },
        sakura: {
          name: 'Sakura Bogʻi',
          description: 'Gullagan yapon gilos daraxtlari va xushboʻy bogʻ',
        },
        cyber: {
          name: 'Cyber Orol',
          description: 'Neon va kiber energiyali kelajak oroli',
        },
        oasis: {
          name: 'Tropik Oazis',
          description: 'Moviy koʻl boʻyidagi issiq tropik yer maydoni',
        },
      },
    },
    speciesNames: {
      apple: {
        name: 'Olma Daraxti',
        desc: 'Shirin qizil olmali mevazor daraxti',
        shortName: 'Olma',
      },
      pine: {
        name: 'Ulugʻ Qaragʻay',
        desc: 'Chidamli va mustahkam yashil ignabargli',
        shortName: 'Qaragʻay',
      },
      sakura: {
        name: 'Sakura (Gilos)',
        desc: 'Goʻzal pushti yapon gilos gullari',
        shortName: 'Sakura',
      },
      oak: {
        name: 'Muhtasham Eman',
        desc: 'Qalin shoxli, ming yillik baquvvat daraxt',
        shortName: 'Eman',
      },
      bamboo: {
        name: 'Bambuk Qamish',
        desc: 'Tez oʻsuvchi, moslashuvchan yashil novdalar',
        shortName: 'Bambuk',
      },
      palm: {
        name: 'Tropik Palma',
        desc: 'Quyoshli, keng bargli tropik oazis daraxti',
        shortName: 'Palma',
      },
    },
    soundscapes: {
      title: 'Miya Ishini Kuchaytiruvchi Fon Ovozlar',
      binauralBeats: 'Binaural Beats (Miya toʻlqinlari)',
      ambientSounds: 'Tabiat & Lo-Fi Ovozlar',
      gammaTitle: 'Gamma (40 Hz) — Oʻta Yuqori Diqqat',
      gammaDesc: 'Murakkab masalalar yechish va chuqur kod yozish uchun',
      betaTitle: 'Beta (20 Hz) — Faol Mantiq',
      betaDesc: 'Imtihonga tayyorgarlik va faol tezkor fikrlash',
      alphaTitle: 'Alpha (10 Hz) — Flow State & Xotira',
      alphaDesc: 'Xotirani mustahkamlash va xotirjam yod olish',
      thetaTitle: 'Theta (6 Hz) — Ijodiy Ilhom',
      thetaDesc: 'Chuqur tasavvur va ijodiy yechimlar topish',
      rain: 'Shifobaxsh Yomgʻir',
      waves: 'Tungi Dengiz Toʻlqinlari',
      forest: 'Zümrad Oʻrmon & Qushlar',
      cafe: 'Shinam Qahvaxona',
      lofi: 'Lo-Fi Chill Synth',
      whiteNoise: 'Oq Shovqin (White Noise)',
      pinkNoise: 'Pushti Shovqin (Pink Noise)',
      brownNoise: 'Jigarrang Shovqin (Brown Noise)',
      clockTick: 'Soat Tiktagi (Tick-Tock)',
      volume: 'Ovoz Balandligi',
      visualizerMode: 'Audio Visualizer Turi',
      wavesVisualizer: 'Kiber Neon Toʻlqinlar',
      barsVisualizer: 'Chastota Ustunlari (Bars)',
      particlesVisualizer: '3D Kvant Zarrachalari',
      ringVisualizer: 'Golografik Zen Halqa',
    },
    analytics: {
      title: 'Fokus & Mahsuldorlik Statistikasi',
      subtitle: 'Barcha darslaringiz va rivojlanishingiz real vaqtda hisoblanadi',
      todayFocus: 'Bugungi Fokus',
      weeklyFocus: 'Haftalik Fokus',
      totalHours: 'Jami Soatlar',
      completedPomodoros: 'Bajarilgan Pomodoro',
      treesPlanted: 'Ekilgan Daraxtlar',
      tasksCompleted: 'Bajarilgan Vazifalar',
      productivityScore: 'Mahsuldorlik Indeksi',
      weeklyChartTitle: 'Soʻnggi 7 kunlik fokus vaqti (Soat)',
      dailyDistribution: 'Kunlik Vaqt Taqsimoti',
      exportData: 'Maʼlumotlarni Yuklab Olish',
      importData: 'Zaxira Faylini Tiklash',
      exportCsv: 'Excel (.csv) formatida yuklash',
      exportJson: 'Toʻliq zaxira (.json) yuklash',
      importSuccess: 'Barcha maʼlumotlar muvaffaqiyatli tiklandi!',
      importError: 'Fayl formati notoʻgʻri yoki buzilgan.',
      clearHistory: 'Tarixni tozalash',
      historyCleared: 'Barcha statistika tozalandi.',
    },
    shortcuts: {
      title: 'Tezkor Klaviatura Tugmalari (Hotkeys)',
      space: 'Taymerni Boshlash / Toʻxtatish',
      rKey: 'Taymerni Qayta Oʻrnatish (Reset)',
      mKey: 'Ovozlarni Yoqish / Oʻchirish (Mute)',
      fKey: 'Toʻliq Ekran Rejimi (Fullscreen)',
      dKey: '3D Kiber Rejimini Yoqish/Oʻchirish',
      tKey: 'Mavzuni Almashtirish (Theme Switch)',
      lKey: 'Tilni Almashtirish (UZ / EN / RU)',
      hKey: 'Tezkor Tugmalar Yoʻriqnomasi',
    },
    themes: {
      dark: 'Kiber Qorongʻu',
      light: 'Yorugʻ Minimalist',
      cyber: 'Neon Kiberpank',
      forest: 'Zümrad Oʻrmon',
      sunset: 'Quyosh Botishi',
      oled: 'Chuqur OLED Qora',
    },
    admin: {
      badge: 'SUPER ADMIN',
      title: 'Maxfiy Boshqaruv & Telemetriya Paneli',
    },
  },
  en: {
    appName: 'VAQT',
    tagline: 'Professional Pomodoro & Focus Studio',
    nav: {
      pomodoro: 'Pomodoro',
      clock: 'Big Clock',
      stopwatch: 'Stopwatch',
      countdown: 'Timer',
      worldClock: 'World Clock',
      tasks: 'Tasks',
      analytics: 'Analytics & Charts',
      code: 'Source Code',
      garden: 'Garden & Lands',
    },
    soundStatus: {
      muted: 'Sound: Muted',
      playing: 'Sound: Playing',
      on: 'Sound: On',
      muteTooltip: 'Sound Muted (Mute: M)',
      unmuteTooltip: 'Sound On (Mute: M)',
      clickToUnmute: 'Sound Muted (Click or press M to unmute)',
      clickToMute: 'Sound On (Click or press M to mute)',
    },
    actions: {
      start: 'Start',
      pause: 'Pause',
      resume: 'Resume',
      reset: 'Reset',
      skip: 'Skip',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      export: 'Export (.json/.csv)',
      import: 'Import (Restore)',
      close: 'Close',
      clear: 'Clear',
      installApp: 'Install App (PWA)',
      enableNotifications: 'Enable Notifications',
      notificationsEnabled: 'Notifications Enabled',
      mute: 'Mute Audio',
      unmute: 'Unmute Audio',
      fullscreen: 'Fullscreen',
      exitFullscreen: 'Exit Fullscreen',
      shortcuts: 'Keyboard Shortcuts',
      toggle3d: '3D Cyber Mode',
    },
    pomodoro: {
      focus: 'Focus Session',
      shortBreak: 'Short Break',
      longBreak: 'Long Break',
      study: 'Deep Study',
      completedCycles: 'Completed Cycles',
      completedDesc: 'Total {mins} minutes of deep focus spent today • Trees grown in {trees} land plots.',
      taskPlaceholder: 'What task are you working on? (e.g. Algorithms & WebGL)',
      digitalClockTab: '⏱️ Digital Clock',
      treeLandTab: '🌱 Tree & Land',
      myGardenBtn: 'My Garden & Lands',
      plantSpeciesLabel: 'Tree to plant:',
      treeGrowingOnPlot: 'growing',
      settingsHeader: 'Pomodoro Settings (In Minutes)',
      focusTimeLabel: '🎯 Focus (min):',
      shortBreakTimeLabel: '☕ Short (min):',
      longBreakTimeLabel: '🌴 Long (min):',
      sessionsCountLabel: 'Sessions',
      viewGardenBtn: 'View Garden & Lands',
      tickSoundTooltip: 'Clock Ticking Sound (Tick-Tock)',
      settingsTooltip: 'Pomodoro Settings',
      clearConfirm: 'Do you want to reset the focus sessions counter?',
      deepFocusMode: 'Deep Focus & Forest Garden',
      deepFocusDesc: 'Leaving this tab will wither your growing tree!',
      autoBreak: 'Auto-start breaks',
      soundAlarm: 'Alarm sound',
      tickSound: 'Ticking sound',
      plantTree: 'Plant tree',
      treeGrowing: 'Tree is growing...',
      treeAlive: 'Healthy tree successfully grown!',
      treeWithered: 'Focus broke — tree withered!',
      sessionFinishedTitle: '🎉 Focus Session Completed!',
      sessionFinishedBody: 'Great job! Time for a well-deserved break.',
      breakFinishedTitle: '⏰ Break Finished!',
      breakFinishedBody: 'Ready to dive into the next productive session?',
      taskGoalLabel: '🎯 Session Goal:',
      treeWitheredWarning: 'Tree withered (Switched to another tab/app)',
      leftAppWarning: 'Warning! Left the app ({count} times)',
      focusProtectionActive: 'Focus Shield Active',
      treeGrowsDuringFocus: 'Tree will grow during study session',
      witheredStatus: 'Withered (0%)',
      maturedStatus: '{percent}% Grown',
    },
    garden: {
      title: 'My Garden & Land Plots',
      subtitle: 'Live lands and trees sprouted during Pomodoro focus sessions',
      aliveCountBadge: '{count} healthy trees',
      view3D: '3D Land Plots',
      viewGallery: 'Gallery',
      aliveTreesStat: 'Green Trees',
      aliveTreesDesc: 'Fully grown productive trees',
      witheredStat: 'Withered Lands',
      witheredDesc: 'Interrupted focus sessions',
      focusTimeStat: 'Focus Time',
      focusTimeDesc: '{hours} hours of study',
      gardenYieldStat: 'Garden Yield',
      gardenYieldDesc: 'Focus success rate',
      landTypeLabel: 'Land Type:',
      waterBtn: 'Water Garden',
      wateringStatus: 'Watering... 💧',
      weatherTooltip: 'Change weather (Sunny / Rain / Night)',
      plantTreeBtn: 'Plant Tree',
      landOccupiedBadge: 'Occupied Plot',
      emptyPlotLabel: 'Empty Soil',
      emptySoil: 'Empty Soil',
      emptyPlotTooltip: 'Empty fertile plot: Start a new Pomodoro session to plant a tree here!',
      plotNumber: 'Plot #{index}',
      filterAll: 'All',
      filterAlive: 'Healthy',
      filterWithered: 'Withered',
      noTreesTitle: 'No trees yet',
      noTreesDesc: 'Start the Pomodoro timer and stay focused. At the end of the session, a new tree will rise in your garden!',
      ruleTitle: 'Rule:',
      ruleDesc: 'Every successful Pomodoro session turns a new land plot into a flourishing tree!',
      clearHistoryBtn: 'Clear History',
      clearConfirm: 'Do you want to clear all planted tree history?',
      aliveMaturedTag: 'Healthy & Mature',
      witheredTag: 'Withered',
      witheredTreeName: 'Withered Tree',
      focusSessionDefault: 'Focus Session',
      minutesFocusTag: '{mins} min deep focus',
      plantedAtLabel: 'Planted at:',
      biomes: {
        meadow: {
          name: 'Green Meadow',
          description: 'Fertile soil and lush green lawn',
        },
        autumn: {
          name: 'Golden Autumn',
          description: 'Serene island covered in yellow and red autumn leaves',
        },
        sakura: {
          name: 'Sakura Garden',
          description: 'Blooming Japanese cherry blossoms and aromatic garden',
        },
        cyber: {
          name: 'Cyber Island',
          description: 'Futuristic island powered by neon and cyber energy',
        },
        oasis: {
          name: 'Tropical Oasis',
          description: 'Warm tropical land by the azure lake',
        },
      },
    },
    speciesNames: {
      apple: {
        name: 'Apple Tree',
        desc: 'Fruity orchard tree with sweet red apples',
        shortName: 'Apple',
      },
      pine: {
        name: 'Evergreen Pine',
        desc: 'Resilient and hardy evergreen pine',
        shortName: 'Pine',
      },
      sakura: {
        name: 'Sakura Blossom',
        desc: 'Beautiful pink Japanese cherry blossoms',
        shortName: 'Sakura',
      },
      oak: {
        name: 'Ancient Oak',
        desc: 'Thick-branched, majestic millennial oak',
        shortName: 'Oak',
      },
      bamboo: {
        name: 'Zen Bamboo',
        desc: 'Fast-growing, flexible green bamboo shoots',
        shortName: 'Bamboo',
      },
      palm: {
        name: 'Tropical Palm',
        desc: 'Sunlit, wide-leafed tropical oasis tree',
        shortName: 'Palm',
      },
    },
    soundscapes: {
      title: 'Brainwave Entrainment & Soundscapes',
      binauralBeats: 'Binaural Beats (Brainwaves)',
      ambientSounds: 'Nature & Lo-Fi Ambience',
      gammaTitle: 'Gamma (40 Hz) — Hyper Focus',
      gammaDesc: 'For complex problem solving and intense coding',
      betaTitle: 'Beta (20 Hz) — Active Cognition',
      betaDesc: 'Exam prep, fast logical thinking and brainstorming',
      alphaTitle: 'Alpha (10 Hz) — Flow State & Memory',
      alphaDesc: 'Relaxed alertness, enhanced memory retention',
      thetaTitle: 'Theta (6 Hz) — Deep Inspiration',
      thetaDesc: 'Creativity, visualization and insight',
      rain: 'Gentle Rain',
      waves: 'Night Ocean Waves',
      forest: 'Emerald Forest & Birds',
      cafe: 'Cozy Coffee Shop',
      lofi: 'Lo-Fi Chill Synth',
      whiteNoise: 'White Noise',
      pinkNoise: 'Pink Noise',
      brownNoise: 'Brown Noise',
      clockTick: 'Mechanical Clock Ticks',
      volume: 'Master Volume',
      visualizerMode: 'Audio Visualizer Mode',
      wavesVisualizer: 'Cyber Neon Waveform',
      barsVisualizer: 'Frequency Bars',
      particlesVisualizer: '3D Quantum Particles',
      ringVisualizer: 'Holographic Zen Ring',
    },
    analytics: {
      title: 'Focus & Productivity Analytics',
      subtitle: 'All your study sessions and stats synced in real-time',
      todayFocus: 'Today Focus',
      weeklyFocus: 'Weekly Focus',
      totalHours: 'Total Hours',
      completedPomodoros: 'Completed Pomodoros',
      treesPlanted: 'Forest Trees',
      tasksCompleted: 'Tasks Done',
      productivityScore: 'Productivity Score',
      weeklyChartTitle: 'Last 7 Days Focus Time (Hours)',
      dailyDistribution: 'Daily Distribution',
      exportData: 'Export Analytics',
      importData: 'Restore Backup',
      exportCsv: 'Download Excel (.csv)',
      exportJson: 'Download Full Backup (.json)',
      importSuccess: 'All data successfully restored!',
      importError: 'Invalid or corrupted backup file.',
      clearHistory: 'Clear History',
      historyCleared: 'All analytics cleared.',
    },
    shortcuts: {
      title: 'Keyboard Shortcuts (Hotkeys)',
      space: 'Start / Pause Timer',
      rKey: 'Reset Timer',
      mKey: 'Mute / Unmute Audio',
      fKey: 'Toggle Fullscreen',
      dKey: 'Toggle 3D Cyber Mode',
      tKey: 'Switch Theme',
      lKey: 'Switch Language (UZ / EN / RU)',
      hKey: 'Show Shortcuts Cheat Sheet',
    },
    themes: {
      dark: 'Cyber Dark',
      light: 'Studio Light Minimalist',
      cyber: 'Neon Cyberpunk',
      forest: 'Emerald Forest',
      sunset: 'Sunset Amber',
      oled: 'Deep OLED Black',
    },
    admin: {
      badge: 'SUPER ADMIN',
      title: 'Secret Telemetry & Control Dashboard',
    },
  },
  ru: {
    appName: 'VAQT',
    tagline: 'Профессиональный Pomodoro и Студия Фокуса',
    nav: {
      pomodoro: 'Помодоро',
      clock: 'Большие Часы',
      stopwatch: 'Секундомер',
      countdown: 'Таймер',
      worldClock: 'Мировое Время',
      tasks: 'Задачи',
      analytics: 'Аналитика и Графики',
      code: 'Исходный Код',
      garden: 'Сад и Земли',
    },
    soundStatus: {
      muted: 'Звук: Выкл',
      playing: 'Звук: Играет',
      on: 'Звук: Вкл',
      muteTooltip: 'Звук выключен (Mute: M)',
      unmuteTooltip: 'Звук включен (Mute: M)',
      clickToUnmute: 'Звук выключен (Нажмите или нажмите M для включения)',
      clickToMute: 'Звук включен (Нажмите или нажмите M для выключения)',
    },
    actions: {
      start: 'Старт',
      pause: 'Пауза',
      resume: 'Продолжить',
      reset: 'Сброс',
      skip: 'Пропустить',
      save: 'Сохранить',
      cancel: 'Отмена',
      delete: 'Удалить',
      edit: 'Редактировать',
      export: 'Экспорт (.json/.csv)',
      import: 'Импорт (Восстановление)',
      close: 'Закрыть',
      clear: 'Очистить',
      installApp: 'Установить приложение (PWA)',
      enableNotifications: 'Включить Уведомления',
      notificationsEnabled: 'Уведомления Включены',
      mute: 'Выключить звук',
      unmute: 'Включить звук',
      fullscreen: 'Во весь экран',
      exitFullscreen: 'Выйти из полноэкранного',
      shortcuts: 'Горячие клавиши',
      toggle3d: '3D Режим',
    },
    pomodoro: {
      focus: 'Сессия Фокуса',
      shortBreak: 'Короткий Перерыв',
      longBreak: 'Длинный Перерыв',
      study: 'Глубокая Учеба',
      completedCycles: 'Завершенные циклы',
      completedDesc: 'Всего {mins} минут глубокого фокуса за сегодня • Деревья выросли на {trees} участках.',
      taskPlaceholder: 'Над какой задачей вы работаете? (Например: Алгоритмы и WebGL)',
      digitalClockTab: '⏱️ Цифровые Часы',
      treeLandTab: '🌱 Дерево и Земля',
      myGardenBtn: 'Мой Сад и Земли',
      plantSpeciesLabel: 'Дерево для посадки:',
      treeGrowingOnPlot: 'растёт',
      settingsHeader: 'Настройки Помодоро (В минутах)',
      focusTimeLabel: '🎯 Фокус (мин):',
      shortBreakTimeLabel: '☕ Короткий (мин):',
      longBreakTimeLabel: '🌴 Длинный (мин):',
      sessionsCountLabel: 'Сессий',
      viewGardenBtn: 'Посмотреть Сад и Земли',
      tickSoundTooltip: 'Звук тиканья часов (Tick-Tock)',
      settingsTooltip: 'Настройки Помодоро',
      clearConfirm: 'Вы хотите сбросить счетчик сессий фокуса?',
      deepFocusMode: 'Глубокий Фокус и Лесной Сад',
      deepFocusDesc: 'Если покинете вкладку, дерево засохнет!',
      autoBreak: 'Авто-старт перерывов',
      soundAlarm: 'Звук будильника',
      tickSound: 'Звук тиканья',
      plantTree: 'Посадить дерево',
      treeGrowing: 'Дерево растет...',
      treeAlive: 'Зеленое дерево успешно выращено!',
      treeWithered: 'Фокус нарушен — дерево засохло!',
      sessionFinishedTitle: '🎉 Сессия фокуса завершена!',
      sessionFinishedBody: 'Отличная работа! Время заслуженного отдыха.',
      breakFinishedTitle: '⏰ Перерыв окончен!',
      breakFinishedBody: 'Готовы к новой продуктивной сессии?',
      taskGoalLabel: '🎯 Цель сессии:',
      treeWitheredWarning: 'Дерево засохло (Переключились на другую вкладку)',
      leftAppWarning: 'Внимание! Вы покинули приложение ({count} раз)',
      focusProtectionActive: 'Защита Фокуса Активна',
      treeGrowsDuringFocus: 'Дерево растет во время учебы',
      witheredStatus: 'Засохло (0%)',
      maturedStatus: '{percent}% Выращено',
    },
    garden: {
      title: 'Мой Сад и Земельные Участки',
      subtitle: 'Живые участки и деревья, выращенные в сессиях фокуса Помодоро',
      aliveCountBadge: '{count} живых деревьев',
      view3D: '3D Участки',
      viewGallery: 'Галерея',
      aliveTreesStat: 'Зеленые Деревья',
      aliveTreesDesc: 'Созревшие плодородные деревья',
      witheredStat: 'Засохшие Участки',
      witheredDesc: 'Прерванные сессии учебы',
      focusTimeStat: 'Время Фокуса',
      focusTimeDesc: '{hours} ч. учебы',
      gardenYieldStat: 'Урожайность Сада',
      gardenYieldDesc: 'Успешность фокуса',
      landTypeLabel: 'Тип Земли:',
      waterBtn: 'Полить Сад',
      wateringStatus: 'Поливается... 💧',
      weatherTooltip: 'Сменить погоду (Солнце / Дождь / Ночь)',
      plantTreeBtn: 'Посадить Дерево',
      landOccupiedBadge: 'Занятый участок',
      emptyPlotLabel: 'Пустая почва',
      emptySoil: 'Пустая почва',
      emptyPlotTooltip: 'Свободный плодородный участок: Начните сессию Помодоро, чтобы вырастить дерево!',
      plotNumber: 'Участок #{index}',
      filterAll: 'Все',
      filterAlive: 'Здоровые',
      filterWithered: 'Засохшие',
      noTreesTitle: 'Пока нет деревьев',
      noTreesDesc: 'Запустите таймер Помодоро и сосредоточьтесь. В конце сессии в вашем саду вырастет новое дерево!',
      ruleTitle: 'Правило:',
      ruleDesc: 'Каждая успешная сессия Помодоро превращает новый участок в цветущее дерево!',
      clearHistoryBtn: 'Очистить историю',
      clearConfirm: 'Вы уверены, что хотите очистить всю историю посаженных деревьев?',
      aliveMaturedTag: 'Живое и созревшее',
      witheredTag: 'Засохшее',
      witheredTreeName: 'Засохшее дерево',
      focusSessionDefault: 'Сессия фокуса',
      minutesFocusTag: '{mins} минут глубокого фокуса',
      plantedAtLabel: 'Время посадки:',
      biomes: {
        meadow: {
          name: 'Зеленая Долина',
          description: 'Плодородная почва и сочный зеленый газон',
        },
        autumn: {
          name: 'Золотой Осенний Сад',
          description: 'Спокойный островок, усыпанный золотыми и багряными листьями',
        },
        sakura: {
          name: 'Сад Сакуры',
          description: 'Цветущая японская вишня и ароматный сад',
        },
        cyber: {
          name: 'Кибер Остров',
          description: 'Футуристический остров с неоновой кибер-энергией',
        },
        oasis: {
          name: 'Тропический Оазис',
          description: 'Теплый тропический оазис у лазурного озера',
        },
      },
    },
    speciesNames: {
      apple: {
        name: 'Яблоня',
        desc: 'Плодовое дерево со спелыми красными яблоками',
        shortName: 'Яблоня',
      },
      pine: {
        name: 'Вечнозеленая Сосна',
        desc: 'Стойкая и величественная сосна',
        shortName: 'Сосна',
      },
      sakura: {
        name: 'Сакура (Вишня)',
        desc: 'Нежные розовые лепестки японской вишни',
        shortName: 'Сакура',
      },
      oak: {
        name: 'Древний Дуб',
        desc: 'Могучий вековой дуб с раскидистой кроной',
        shortName: 'Дуб',
      },
      bamboo: {
        name: 'Дзэн Бамбук',
        desc: 'Быстрорастущие гибкие зеленые стебли',
        shortName: 'Бамбук',
      },
      palm: {
        name: 'Тропическая Пальма',
        desc: 'Солнечная пальма с широкими пышными листьями',
        shortName: 'Пальма',
      },
    },
    soundscapes: {
      title: 'Бинауральные Ритмы и Звуки Природы',
      binauralBeats: 'Бинауральные ритмы (Мозговые волны)',
      ambientSounds: 'Природа и Lo-Fi музыка',
      gammaTitle: 'Гамма (40 Гц) — Гипер-концентрация',
      gammaDesc: 'Для решения сложнейших задач и кодинга',
      betaTitle: 'Бета (20 Гц) — Активная логика',
      betaDesc: 'Подготовка к экзаменам и быстрый анализ',
      alphaTitle: 'Альфа (10 Гц) — Состояние Потока',
      alphaDesc: 'Спокойное запоминание и усвоение информации',
      thetaTitle: 'Тета (6 Гц) — Творческое вдохновение',
      thetaDesc: 'Глубокое воображение и интуитивные идеи',
      rain: 'Целебный Дождь',
      waves: 'Ночные Волны Океана',
      forest: 'Изумрудный Лес и Птицы',
      cafe: 'Уютная Кофейня',
      lofi: 'Lo-Fi Chill Synth',
      whiteNoise: 'Белый Шум',
      pinkNoise: 'Розовый Шум',
      brownNoise: 'Коричневый Шум',
      clockTick: 'Тиканье Часов',
      volume: 'Громкость',
      visualizerMode: 'Визуализатор Звука',
      wavesVisualizer: 'Кибер Неоновая Волна',
      barsVisualizer: 'Частотные Столбцы',
      particlesVisualizer: '3D Квантовые Частицы',
      ringVisualizer: 'Голографическое Кольцо',
    },
    analytics: {
      title: 'Аналитика Продуктивности',
      subtitle: 'Вся статистика ваших сессий в реальном времени',
      todayFocus: 'Сегодня',
      weeklyFocus: 'За неделю',
      totalHours: 'Всего часов',
      completedPomodoros: 'Завершено Помодоро',
      treesPlanted: 'Деревьев выращено',
      tasksCompleted: 'Задач выполнено',
      productivityScore: 'Индекс Продуктивности',
      weeklyChartTitle: 'Время фокуса за последние 7 дней (Часы)',
      dailyDistribution: 'Распределение времени',
      exportData: 'Скачать Аналитику',
      importData: 'Восстановить из Копии',
      exportCsv: 'Скачать Excel (.csv)',
      exportJson: 'Полный бэкап (.json)',
      importSuccess: 'Все данные успешно восстановлены!',
      importError: 'Неверный или поврежденный файл.',
      clearHistory: 'Очистить историю',
      historyCleared: 'Вся аналитика очищена.',
    },
    shortcuts: {
      title: 'Горячие Клавиши (Hotkeys)',
      space: 'Старт / Пауза Таймера',
      rKey: 'Сброс Таймера (Reset)',
      mKey: 'Вкл / Выкл Звук (Mute)',
      fKey: 'Полноэкранный Режим',
      dKey: 'Вкл / Выкл 3D Кибер Режим',
      tKey: 'Переключение Темы',
      lKey: 'Смена Языка (UZ / EN / RU)',
      hKey: 'Справка по Горячим Клавишам',
    },
    themes: {
      dark: 'Кибер Темная',
      light: 'Студийная Светлая',
      cyber: 'Неоновый Киберпанк',
      forest: 'Изумрудный Лес',
      sunset: 'Закат',
      oled: 'Глубокий OLED Черный',
    },
    admin: {
      badge: 'SUPER ADMIN',
      title: 'Секретная Панель Телеметрии',
    },
  },
};

