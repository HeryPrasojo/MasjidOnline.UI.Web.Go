const moFetch = {};

(() =>
{
	const sessionIdHeaderName = 'Mo-Sess';

	moFetch.fetch = async (url, options) =>
	{
		// url = url.replace(/^\|+|\|+$/g, '');

		const response = await fetch(url, options);

		// if (!response.ok) throw Error(response.status + ' ' + response.statusText);

		return response;
	};

	moFetch.fetchText = async (url, options) =>
	{
		const response = await moFetch.fetch(url, options);

		return await response.text();
	};

	moFetch.fetchApi = async (url, options, skipStringify) =>
	{
		options ??= {};
		options.method = 'POST';

		options.headers ??= new Headers();

		if (typeof options.body != 'undefined' && !(options.body instanceof FormData))
		{
			const hasContentType = options.headers.has("Content-Type");

			if (!hasContentType) options.headers.append("Content-Type", "application/json");

			if (!skipStringify) options.body = JSON.stringify(options.body);
		}


		if (url != 'session/create')
		{
			const sessionId = await getSession();

			if (!sessionId) return;

			options.headers.append(sessionIdHeaderName, sessionId);
		}


		const response = await moFetch.fetch(mo.backendUriPrefix + url, options);

		if (response.status != 200)
		{
			console.error(`response.status: ${response.status} ${response.statusText}`);

			return {
				resultCode: 'fetch failed',
				resultMessage: `response.status: ${response.status} ${response.statusText}`,
			};
		}


		let resultCode;

		const contentType = response.headers.get('Content-Type');

		if (contentType && contentType.indexOf('application/json') > -1)
		{
			const json = await response.clone().json();

			resultCode = json.ResultCode;

			// if (json.ResultCode) throw Error(json.ResultCode + ' ' + json.ResultMessage);
		}
		else
		{
			resultCode = response.headers.get("Mo-Result-Code");

			// if (resultCode) throw Error(resultCode + ' ' + response.headers.get("Mo-Result-Message"));
		}

		if (resultCode == 5)
		{
			mo.removeSession();

			options.headers.delete(sessionIdHeaderName);

			return moFetch.fetchApi(url, options, true);
		}

		return response;
	};

	moFetch.fetchApiJson = async (url, options) =>
	{
		const response = await moFetch.fetchApi(url, options);

		return await response.json();
	};


	moFetch.fetchAnonymInfaqBankTransfer = async (formData) =>
	{
		await addRequestCaptchaToken(formData, 'infaq');

		return await moFetch.fetchApiJson('infaq/infaq/add/anonym', { body: formData });
	};

	moFetch.fetchInfaqList = async (body) =>
	{
		return await moFetch.fetchApiJson('infaq/infaq/getMany', { body });
	};

	moFetch.fetchLogin = async (body) =>
	{
		await addRequestCaptchaToken(body, 'login');

		return await moFetch.fetchApiJson('user/login', { body });
	};

	moFetch.fetchRecommendationNote = async () =>
	{
		const body = {};

		await addRequestCaptchaToken(body, 'recommendationNote');

		return await moFetch.fetchApiJson('payment/manual/getRecommendationNote', { body });
	};

	moFetch.fetchRegister = async (body) =>
	{
		await addRequestCaptchaToken(body, 'register');

		return await moFetch.fetchApiJson('user/register', { body });
	};

	moFetch.fetchSetPassword = async (body) =>
	{
		await addRequestCaptchaToken(body, 'verifySetPassword');

		return await moFetch.fetchApiJson('user/verifySetPassword', { body });
	};

	moFetch.fetchUserInternalList = async (body) =>
	{
		return await moFetch.fetchApiJson('user/internal/getMany', { body });
	};

	moFetch.fetchUserInternalView = async (body) =>
	{
		return await moFetch.fetchApiJson('user/internal/getOne', { body });
	};

	moFetch.fetchVerifyRegister = async (body) =>
	{
		await addRequestCaptchaToken(body, 'verifyRegister');

		return await moFetch.fetchApiJson('user/verifyRegister', { body });
	};


	// TODO move to captcha.js

	async function addRequestCaptchaToken(body, action)
	{
		if (body instanceof FormData)
		{
			if (!body.has('CaptchaToken'))
			{
				const captchaToken = await getCaptchaToken(action);

				body.append('CaptchaToken', captchaToken);
			}
		}
		else
		{
			if (!body.CaptchaToken)
			{
				const captchaToken = await getCaptchaToken(action);

				body.CaptchaToken = captchaToken;
			}
		}
	}

	async function getCaptchaToken(action)
	{
		return await grecaptcha.enterprise.execute(mo.recaptchaSiteKey, { action: action + mo.recaptchaActionAffix });
	}

	async function getSession()
	{
		let sessionId = moStorage.getSession();

		if (!sessionId)
		{
			const json = await moFetch.fetchApiJson(
				'session/create',
				{
					body:
					{
						ApplicationCulture: 1, // english
						CaptchaToken: await getCaptchaToken('session'),
					},
				});

			if (json.ResultCode) return;

			sessionId = json.Data;

			moStorage.setSession(sessionId);
		}

		return sessionId;
	};

})();
