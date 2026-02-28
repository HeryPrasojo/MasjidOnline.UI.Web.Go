const moAuthorization =
{
    authorizeAnonymous: () =>
    {
        const userType = moCookie.getUserType();

        if (userType && (userType != 1)) location.href = '/';
    },
};
