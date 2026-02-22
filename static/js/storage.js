const moStorage = {};

(() =>
{
    const isLoggedInStorageKey = 'isLoggedIn';
    const permissionStorageKey = 'permission'
    const recommendationNoteStorageKey = 'recommendationNote';
    const sessionIdStorageKey = 'sessionId';


    moStorage.removeIsLoggedIn = () =>
    {
        localStorage.removeItem(isLoggedInStorageKey);

        moStorage.removePermission();
    };

    moStorage.getIsLoggedIn = () =>
    {
        return localStorage.getItem(isLoggedInStorageKey);
    }

    moStorage.setLoggedIn = () =>
    {
        localStorage.setItem(isLoggedInStorageKey, true);
    }


    moStorage.getPermission = () =>
    {
        const stringValue = localStorage.getItem(permissionStorageKey);

        if (!stringValue) return;

        return JSON.parse(stringValue);
    };

    moStorage.removePermission = () =>
    {
        localStorage.removeItem(permissionStorageKey);
    };

    moStorage.setPermission = (value) =>
    {
        if (!value) return;

        const stringValue = JSON.stringify(value);

        localStorage.setItem(permissionStorageKey, stringValue);
    }


    moStorage.removeRecommendationNote = () =>
    {
        localStorage.removeItem(recommendationNoteStorageKey);
    };

    moStorage.getRecommendationNote = () =>
    {
        return localStorage.getItem(recommendationNoteStorageKey);
    }

    moStorage.setRecommendationNote = (note) =>
    {
        localStorage.setItem(recommendationNoteStorageKey, note);
    }


    moStorage.getSession = () =>
    {
        return localStorage.getItem(sessionIdStorageKey);
    };

    moStorage.removeSession = () =>
    {
        localStorage.removeItem(sessionIdStorageKey);

        moStorage.removeIsLoggedIn();
    };

    moStorage.setSession = (id) =>
    {
        localStorage.setItem(sessionIdStorageKey, id);
    }

})();
