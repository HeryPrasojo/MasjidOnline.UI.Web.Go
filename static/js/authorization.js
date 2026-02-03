const moAuthorization =
{
    authorizeAnonymous: () =>
    {
        if (mo.getIsLoggedIn()) location.href = '/';
    },
};
