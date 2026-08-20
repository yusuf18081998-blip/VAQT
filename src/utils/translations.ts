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
  };
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
    tagline: '3D Cybernetic Pomodoro & Diqqat Studiyasi',
    nav: {
      pomodoro: 'Pomodoro',
      clock: 'Katta Soat',
      stopwatch: 'Sekundomer',
      countdown: 'Taymer',
      worldClock: 'Dunyo Soati',
      tasks: 'Vazifalar',
      analytics: 'Statistika & Grafiklar',
      code: 'Manba Kodi',
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
    tagline: '3D Cybernetic Pomodoro & Focus Studio',
    nav: {
      pomodoro: 'Pomodoro',
      clock: 'Big Clock',
      stopwatch: 'Stopwatch',
      countdown: 'Timer',
      worldClock: 'World Clock',
      tasks: 'Tasks',
      analytics: 'Analytics & Charts',
      code: 'Source Code',
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
    tagline: '3D Кибернетический Pomodoro и Студия Фокуса',
    nav: {
      pomodoro: 'Помодоро',
      clock: 'Большие Часы',
      stopwatch: 'Секундомер',
      countdown: 'Таймер',
      worldClock: 'Мировое Время',
      tasks: 'Задачи',
      analytics: 'Аналитика и Графики',
      code: 'Исходный Код',
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
