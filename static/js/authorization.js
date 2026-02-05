const moAuthorization =
{
    authorizeAnonymous: () =>
    {
        if (moStorage.getIsLoggedIn()) location.href = '/';
    },
};
