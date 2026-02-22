(() =>
{
	var navLandscapeParent;
	var navPortraitParent;

	if (document.readyState == 'loading')
		document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
	else
		onDOMContentLoaded();

	document.addEventListener("moLayoutChanged", loadNavigation);

	async function onDOMContentLoaded()
	{
		navLandscapeParent = mo.getElementById('navLandscapeParent');
		navPortraitParent = mo.getElementById('navPortraitParent');

		await loadNavigation();
	}

	async function loadNavigation()
	{
		if (moLayout.isPortrait())
		{
			if (!mo.getElementById('navPortrait'))
			{
				const text = await moFetch.fetchText('/navigation');

				navPortraitParent.innerHTML = text;
			}

			addLogoutListener('navPortraitLogout');

			const navPortraitTheRestButton = mo.getElementById('navPortraitTheRestButton');
			const navPortraitTheRest = mo.getElementById('navPortraitTheRest');
			const navPortraitTheRestSubItemParentInfaqButton = mo.getElementById('navPortraitTheRestSubItemParentInfaqButton');

			navPortraitTheRestButton.addEventListener("click", onClick);

			window.addEventListener('click', onWindowClick);

			function onClick()
			{
				navPortraitTheRest.classList.toggle("display-none");
			}

			function onWindowClick(event)
			{
				if ((event.target != navPortraitTheRestButton) && (event.target != navPortraitTheRestSubItemParentInfaqButton))
				{
					navPortraitTheRest.classList.add("display-none");
				}
			}
		}
		else
		{
			if (!mo.getElementById('navLandscape'))
			{
				const text = await moFetch.fetchText('/navigation');

				navLandscapeParent.innerHTML = text;
			}

			addLogoutListener('navLandscapeLogout');
		}

		function addLogoutListener(selector)
		{
			const navLogout = mo.getElementById(selector);

			if (navLogout)
			{
				navLogout.addEventListener('click', () =>
				{
					moHub.sendUserLogout();
				});
			}
		}
	}

})();
