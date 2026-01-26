(() =>
{
    if (document.readyState === "complete")
        onLoaded();
    else
        window.addEventListener('load', onLoaded);

    function onLoaded()
    {
        const pageLoading = mo.getElementById('pageLoading');

        pageLoading.remove();
    }

})();
