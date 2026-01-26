const moStorage = {};

(() =>
{
    const applicationCultureStorageKey = 'applicationCulture';
    const isLoggedInStorageKey = 'isLoggedIn';
    const permissionStorageKey = 'permission'
    const recommendationNoteStorageKey = 'recommendationNote';
    const sessionIdStorageKey = 'sessionId';
    const userTypeStorageKey = 'userType';


    moStorage.getApplicationCulture = () =>
    {
        return localStorage.getItem(applicationCultureStorageKey);
    }

    moStorage.setApplicationCulture = (value) =>
    {
        localStorage.setItem(applicationCultureStorageKey, value);
    }


    moStorage.removeIsLoggedIn = () =>
    {
        localStorage.removeItem(isLoggedInStorageKey);

        moStorage.removePermission();

        moStorage.removeUserType();
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


    moStorage.getUserType = () =>
    {
        return localStorage.getItem(userTypeStorageKey);
    }

    moStorage.removeUserType = () =>
    {
        localStorage.removeItem(userTypeStorageKey);
    };

    moStorage.setUserType = (type) =>
    {
        localStorage.setItem(userTypeStorageKey, type);
    }

})();
