import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

export type Language = 'en' | 'ar';

interface Translations {
  [key: string]: { en: string; ar: string };
}

const translations: Translations = {
  'nav.home': { en: 'Home', ar: 'الرئيسية' },
  'nav.movies': { en: 'Movies', ar: 'الأفلام' },
  'nav.genres': { en: 'Genres', ar: 'الأنواع' },
  'nav.search': { en: 'Search', ar: 'بحث' },
  'nav.favorites': { en: 'Favorites', ar: 'المفضلة' },
  'nav.history': { en: 'History', ar: 'السجل' },
  'nav.profile': { en: 'Profile', ar: 'الملف' },
  'nav.admin': { en: 'Admin', ar: 'الإدارة' },
  'nav.login': { en: 'Login', ar: 'تسجيل الدخول' },
  'nav.signup': { en: 'Sign Up', ar: 'إنشاء حساب' },
  'nav.logout': { en: 'Logout', ar: 'تسجيل الخروج' },

  'hero.watchNow': { en: 'Watch Now', ar: 'شاهد الآن' },
  'hero.moreInfo': { en: 'More Info', ar: 'المزيد من المعلومات' },
  'hero.rating': { en: 'Rating', ar: 'التقييم' },
  'hero.year': { en: 'Year', ar: 'السنة' },
  'hero.genre': { en: 'Genre', ar: 'النوع' },

  'section.featured': { en: 'Featured Movies', ar: 'أفلام مميزة' },
  'section.latest': { en: 'Latest Movies', ar: 'أحدث الأفلام' },
  'section.popular': { en: 'Popular Movies', ar: 'أفلام شائعة' },
  'section.trending': { en: 'Trending Movies', ar: 'الأفلام الرائجة' },
  'section.recommended': { en: 'Recommended Movies', ar: 'أفلام موصى بها' },
  'section.action': { en: 'Action', ar: 'أكشن' },
  'section.comedy': { en: 'Comedy', ar: 'كوميديا' },
  'section.drama': { en: 'Drama', ar: 'دراما' },
  'section.horror': { en: 'Horror', ar: 'رعب' },
  'section.scifi': { en: 'Sci-Fi', ar: 'خيال علمي' },
  'section.animation': { en: 'Animation', ar: 'أنيميشن' },
  'section.thriller': { en: 'Thriller', ar: 'إثارة' },

  'search.placeholder': { en: 'Search movies...', ar: 'ابحث عن الأفلام...' },
  'search.results': { en: 'Search Results', ar: 'نتائج البحث' },
  'search.noResults': { en: 'No movies found', ar: 'لا توجد أفلام' },
  'search.tryDifferent': { en: 'Try a different search term', ar: 'جرب كلمة بحث أخرى' },

  'details.originalTitle': { en: 'Original Title', ar: 'العنوان الأصلي' },
  'details.releaseDate': { en: 'Release Date', ar: 'تاريخ الإصدار' },
  'details.runtime': { en: 'Runtime', ar: 'المدة' },
  'details.genres': { en: 'Genres', ar: 'الأنواع' },
  'details.cast': { en: 'Cast', ar: 'طاقم الممثلين' },
  'details.director': { en: 'Director', ar: 'المخرج' },
  'details.addFavorites': { en: 'Add to Favorites', ar: 'أضف إلى المفضلة' },
  'details.removeFavorites': { en: 'Remove from Favorites', ar: 'إزالة من المفضلة' },
  'details.noMagnet': { en: 'No stream available for this movie', ar: 'لا يوجد بث متاح لهذا الفيلم' },
  'details.noStream': { en: 'No stream available for this movie', ar: 'لا يوجد بث متاح لهذا الفيلم' },

  'player.connecting': { en: 'Connecting...', ar: 'جاري الاتصال...' },
  'player.findingPeers': { en: 'Finding Peers...', ar: 'البحث عن الأقران...' },
  'player.loading': { en: 'Loading...', ar: 'جاري التحميل...' },
  'player.buffering': { en: 'Buffering...', ar: 'جاري التخزين المؤقت...' },
  'player.playing': { en: 'Playing', ar: 'قيد التشغيل' },
  'player.error': { en: 'Error', ar: 'خطأ' },
  'player.selectFile': { en: 'Select a video file', ar: 'اختر ملف الفيديو' },
  'player.noPeers': { en: 'Unable to connect to this torrent from your browser. This torrent may not have WebTorrent/WebRTC-compatible peers.', ar: 'تعذر الاتصال بهذا التورنت من المتصفح. قد لا يكون للتورنت أقران متوافقون مع WebTorrent/WebRTC.' },
  'player.connectionFailed': { en: 'Failed to connect to the torrent. Please try again later.', ar: 'فشل الاتصال بالتورنت. يرجى المحاولة لاحقاً.' },
  'player.invalidMagnet': { en: 'Invalid Magnet Link', ar: 'رابط الماغنت غير صالح' },
  'player.noVideoFile': { en: 'No playable video was found in this torrent', ar: 'لم يتم العثور على فيديو قابل للتشغيل في هذا التورنت' },
  'player.peers': { en: 'Peers', ar: 'الأقران' },
  'player.downloadSpeed': { en: 'Download', ar: 'التحميل' },
  'player.progress': { en: 'Downloaded', ar: 'تم تحميله' },
  'player.back': { en: 'Back to Movie', ar: 'العودة للفيلم' },
  'player.retry': { en: 'Retry', ar: 'إعادة المحاولة' },
  'player.restart': { en: 'Restart', ar: 'إعادة التشغيل' },
  'player.pip': { en: 'Picture in Picture', ar: 'صورة داخل صورة' },
  'player.speed': { en: 'Speed', ar: 'السرعة' },
  'player.subtitles': { en: 'Subtitles', ar: 'الترجمة' },
  'player.subtitlesOff': { en: 'Off', ar: 'إيقاف' },
  'player.preparingVideo': { en: 'Preparing video...', ar: 'جاري تحضير الفيديو...' },
  'player.startingPlayback': { en: 'Starting playback...', ar: 'بدء التشغيل...' },

  'auth.email': { en: 'Email', ar: 'البريد الإلكتروني' },
  'auth.password': { en: 'Password', ar: 'كلمة المرور' },
  'auth.displayName': { en: 'Display Name', ar: 'الاسم' },
  'auth.login': { en: 'Login', ar: 'تسجيل الدخول' },
  'auth.signup': { en: 'Sign Up', ar: 'إنشاء حساب' },
  'auth.resetPassword': { en: 'Reset Password', ar: 'إعادة تعيين كلمة المرور' },
  'auth.sendResetLink': { en: 'Send Reset Link', ar: 'إرسال رابط إعادة التعيين' },
  'auth.noAccount': { en: "Don't have an account?", ar: 'ليس لديك حساب؟' },
  'auth.haveAccount': { en: 'Already have an account?', ar: 'لديك حساب بالفعل؟' },
  'auth.forgotPassword': { en: 'Forgot password?', ar: 'نسيت كلمة المرور؟' },
  'auth.loginSuccess': { en: 'Logged in successfully', ar: 'تم تسجيل الدخول بنجاح' },
  'auth.signupSuccess': { en: 'Account created successfully', ar: 'تم إنشاء الحساب بنجاح' },
  'auth.resetSent': { en: 'Password reset link sent to your email', ar: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك' },
  'auth.loginFailed': { en: 'Invalid email or password', ar: 'بريد إلكتروني أو كلمة مرور غير صحيحة' },
  'auth.signupFailed': { en: 'Failed to create account', ar: 'فشل إنشاء الحساب' },
  'auth.resetFailed': { en: 'Failed to send reset link', ar: 'فشل إرسال رابط إعادة التعيين' },
  'auth.backToLogin': { en: 'Back to Login', ar: 'العودة لتسجيل الدخول' },

  'favorites.empty': { en: 'No favorites yet', ar: 'لا توجد مفضلات بعد' },
  'favorites.emptyDesc': { en: 'Movies you favorite will appear here', ar: 'الأفلام التي تفضلها ستظهر هنا' },
  'favorites.title': { en: 'Your Favorites', ar: 'مفضلاتك' },

  'history.empty': { en: 'No watch history', ar: 'لا يوجد سجل مشاهدة' },
  'history.emptyDesc': { en: 'Movies you watch will appear here', ar: 'الأفلام التي تشاهدها ستظهر هنا' },
  'history.title': { en: 'Watch History', ar: 'سجل المشاهدة' },
  'history.continueWatching': { en: 'Continue Watching', ar: 'متابعة المشاهدة' },

  'profile.title': { en: 'Profile', ar: 'الملف الشخصي' },
  'profile.email': { en: 'Email', ar: 'البريد الإلكتروني' },
  'profile.displayName': { en: 'Display Name', ar: 'الاسم' },
  'profile.role': { en: 'Role', ar: 'الدور' },
  'profile.save': { en: 'Save Changes', ar: 'حفظ التغييرات' },
  'profile.saved': { en: 'Profile updated', ar: 'تم تحديث الملف' },
  'profile.roleUser': { en: 'User', ar: 'مستخدم' },
  'profile.roleAdmin': { en: 'Admin', ar: 'مدير' },

  'admin.dashboard': { en: 'Dashboard', ar: 'لوحة التحكم' },
  'admin.movies': { en: 'Movies', ar: 'الأفلام' },
  'admin.users': { en: 'Users', ar: 'المستخدمون' },
  'admin.addMovie': { en: 'Add Movie', ar: 'إضافة فيلم' },
  'admin.editMovie': { en: 'Edit Movie', ar: 'تعديل فيلم' },
  'admin.totalMovies': { en: 'Total Movies', ar: 'إجمالي الأفلام' },
  'admin.published': { en: 'Published', ar: 'منشور' },
  'admin.unpublished': { en: 'Unpublished', ar: 'غير منشور' },
  'admin.totalUsers': { en: 'Total Users', ar: 'إجمالي المستخدمين' },
  'admin.recentAdditions': { en: 'Recent Additions', ar: 'الإضافات الحديثة' },
  'admin.searchMovies': { en: 'Search movies...', ar: 'ابحث عن الأفلام...' },
  'admin.fetchData': { en: 'Fetch Movie Data', ar: 'جلب بيانات الفيلم' },
  'admin.movieName': { en: 'Movie name or IMDb ID', ar: 'اسم الفيلم أو معرف IMDb' },
  'admin.magnetLink': { en: 'Magnet Link', ar: 'رابط الماغنت' },
  'admin.streamLinks': { en: 'Stream Links', ar: 'روابط البث' },
  'admin.streamUrl': { en: 'Direct Stream URL (mp4, webm, etc.)', ar: 'رابط بث مباشر (mp4, webm, إلخ)' },
  'admin.streamUrlHint': { en: 'This movie will play instantly from this URL', ar: 'سيتم تشغيل هذا الفيلم فوراً من هذا الرابط' },
  'admin.magnetPlaceholder': { en: 'magnet:?xt=urn:btih:...', ar: 'magnet:?xt=urn:btih:...' },
  'admin.save': { en: 'Save Movie', ar: 'حفظ الفيلم' },
  'admin.cancel': { en: 'Cancel', ar: 'إلغاء' },
  'admin.delete': { en: 'Delete', ar: 'حذول' },
  'admin.edit': { en: 'Edit', ar: 'تعديل' },
  'admin.publish': { en: 'Publish', ar: 'نشر' },
  'admin.unpublish': { en: 'Unpublish', ar: 'إلغاء النشر' },
  'admin.confirmDelete': { en: 'Are you sure you want to delete this movie?', ar: 'هل أنت متأكد من حذف هذا الفيلم؟' },
  'admin.saved': { en: 'Movie saved successfully', ar: 'تم حفظ الفيلم بنجاح' },
  'admin.deleted': { en: 'Movie deleted', ar: 'تم حذف الفيلم' },
  'admin.fetchFailed': { en: 'Failed to fetch movie data from TMDB', ar: 'فشل جلب بيانات الفيلم من TMDB' },
  'admin.noResults': { en: 'No movies found on TMDB', ar: 'لم يتم العثور على أفلام في TMDB' },
  'admin.selectFromResults': { en: 'Select a movie from the results', ar: 'اختر فيلماً من النتائج' },
  'admin.movieTitle': { en: 'Title (English)', ar: 'العنوان (بالإنجليزية)' },
  'admin.movieTitleAr': { en: 'Title (Arabic)', ar: 'العنوان (بالعربية)' },
  'admin.description': { en: 'Description (English)', ar: 'الوصف (بالإنجليزية)' },
  'admin.descriptionAr': { en: 'Description (Arabic)', ar: 'الوصف (بالعربية)' },
  'admin.posterUrl': { en: 'Poster URL', ar: 'رابط الملصق' },
  'admin.backdropUrl': { en: 'Backdrop URL', ar: 'رابط الخلفية' },
  'admin.releaseDate': { en: 'Release Date', ar: 'تاريخ الإصدار' },
  'admin.runtime': { en: 'Runtime (minutes)', ar: 'المدة (دقائق)' },
  'admin.genres': { en: 'Genres (English, comma separated)', ar: 'الأنواع (بالإنجليزية، مفصولة بفواصل)' },
  'admin.genresAr': { en: 'Genres (Arabic, comma separated)', ar: 'الأنواع (بالعربية، مفصولة بفواصل)' },
  'admin.cast': { en: 'Cast (English, comma separated)', ar: 'الممثلون (بالإنجليزية، مفصولون بفواصل)' },
  'admin.castAr': { en: 'Cast (Arabic, comma separated)', ar: 'الممثلون (بالعربية، مفصولون بفواصل)' },
  'admin.director': { en: 'Director (English)', ar: 'المخرج (بالإنجليزية)' },
  'admin.directorAr': { en: 'Director (Arabic)', ar: 'المخرج (بالعربية)' },
  'admin.imdbId': { en: 'IMDb ID', ar: 'معرف IMDb' },
  'admin.tmdbId': { en: 'TMDB ID', ar: 'معرف TMDB' },
  'admin.featured': { en: 'Featured', ar: 'مميز' },
  'admin.publishedLabel': { en: 'Published', ar: 'منشور' },
  'admin.accessDenied': { en: 'Access denied. Admin only.', ar: 'تم رفض الوصول. للمديرين فقط.' },
  'admin.validation.required': { en: 'Title is required', ar: 'العنوان مطلوب' },
  'admin.validation.magnet': { en: 'Invalid magnet link format', ar: 'تنسيق رابط الماغنت غير صالح' },
  'admin.validation.duplicate': { en: 'A movie with this title and year already exists', ar: 'فيلم بهذا العنوان والسنة موجود بالفعل' },
  'admin.updateFromTMDB': { en: 'Update from TMDB', ar: 'تحديث من TMDB' },
  'admin.updateConfirm': { en: 'This will fetch the latest metadata from TMDB in both English and Arabic. Fields you have manually edited will be overwritten. Continue?', ar: 'سيتم جلب أحدث البيانات من TMDB باللغتين الإنجليزية والعربية. الحقول التي قمت بتعديلها يدوياً سيتم استبدالها. هل تريد المتابعة؟' },
  'admin.fetchingBilingual': { en: 'Fetching English & Arabic data from TMDB...', ar: 'جلب البيانات بالإنجليزية والعربية من TMDB...' },
  'admin.bilingualSuccess': { en: 'English & Arabic data fetched successfully', ar: 'تم جلب البيانات بالإنجليزية والعربية بنجاح' },
  'admin.arabicUnavailable': { en: 'Arabic content not available on TMDB for this movie', ar: 'المحتوى العربي غير متوفر في TMDB لهذا الفيلم' },
  'admin.englishSection': { en: 'English Content', ar: 'المحتوى الإنجليزي' },
  'admin.arabicSection': { en: 'Arabic Content', ar: 'المحتوى العربي' },

  'common.loading': { en: 'Loading...', ar: 'جاري التحميل...' },
  'common.error': { en: 'Something went wrong', ar: 'حدث خطأ ما' },
  'common.retry': { en: 'Retry', ar: 'إعادة المحاولة' },
  'common.noMovies': { en: 'No movies available', ar: 'لا توجد أفلام متاحة' },
  'common.movieNotFound': { en: 'Movie not found', ar: 'الفيلم غير موجود' },
  'common.loginRequired': { en: 'Please log in to continue', ar: 'يرجى تسجيل الدخول للمتابعة' },
  'common.close': { en: 'Close', ar: 'إغلاق' },
  'common.search': { en: 'Search', ar: 'بحث' },
  'common.allGenres': { en: 'All Genres', ar: 'كل الأنواع' },
  'common.allYears': { en: 'All Years', ar: 'كل السنوات' },
  'common.viewAll': { en: 'View All', ar: 'عرض الكل' },

  'install.button': { en: 'Install App', ar: 'تثبيت التطبيق' },
  'install.installed': { en: 'Installed', ar: 'مثبت' },

  'player.noImdb': { en: 'Video source is not configured.', ar: 'مصدر الفيديو غير مضاف.' },
  'player.loadingPlayer': { en: 'Loading player...', ar: 'جاري تحميل المشغل...' },
  'admin.imdbIdInvalid': { en: 'Please enter a valid IMDb ID.', ar: 'يرجى إدخال IMDb ID صحيح.' },
  'admin.imdbIdRequired': { en: 'IMDb ID is required', ar: 'معرف IMDb مطلوب' },
  'admin.updateAll': { en: 'Update All from TMDB', ar: 'تحديث الكل من TMDB' },
  'admin.updateAllConfirm': { en: 'This will fetch fresh metadata from TMDB for every movie on this page. Existing fields will be overwritten. Continue?', ar: 'سيتم جلب أحدث البيانات من TMDB لكل فيلم في هذه الصفحة. الحقول الحالية سيتم استبدالها. هل تريد المتابعة؟' },
  'admin.updateAllProgress': { en: 'Updating {done} of {total}...', ar: 'تحديث {done} من {total}...' },
  'admin.updateAllDone': { en: 'Updated {done} of {total} movies', ar: 'تم تحديث {done} من {total} فيلم' },
  'admin.updateAllSkipped': { en: 'Skipped {count} movies without TMDB ID', ar: 'تم تخطي {count} فيلم بدون معرف TMDB' },
  'admin.updateAllFailed': { en: '{count} movies failed to update', ar: 'فشل تحديث {count} فيلم' },
};

interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = 'cinestream-lang';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    return stored === 'ar' || stored === 'en' ? stored : 'en';
  });

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang, dir]);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
  }, []);

  const t = useCallback((key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] || entry.en || key;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
