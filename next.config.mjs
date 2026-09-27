const basePath = (process.env.BASE_PATH ?? '/smena-ryadom').replace(/\/$/, '');
export default {
 output:'export', trailingSlash:true, basePath,
 images:{unoptimized:true},
 env:{NEXT_PUBLIC_BASE_PATH:basePath},
 experimental:{cpus:2},
};
