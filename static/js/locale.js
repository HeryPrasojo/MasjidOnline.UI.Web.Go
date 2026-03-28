const moLocale = {

    get: function (dict)
    {
        const locale = moCookie.getApplicationCulture();

        return dict[locale || 0];
    },
};

(() =>
{
})();
