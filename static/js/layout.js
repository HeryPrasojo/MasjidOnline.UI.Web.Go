const moLayout = {
	isPortrait: () => screen.orientation.type.startsWith('portrait'),
};

(() =>
{
	const cookieOrientation = mo.getCookie('o');
	if (moLayout.isPortrait() && (cookieOrientation != 1))
	{
		document.cookie = "o=1";

		location.reload();

		return;
	}
	else if (!moLayout.isPortrait() && (cookieOrientation != 0))
	{
		document.cookie = "o=0";

		location.reload();

		return;
	}

	if (document.readyState == 'loading')
		document.addEventListener("DOMContentLoaded", layout);
	else
		layout();

	screen.orientation.addEventListener("change", layout);

	function layout()
	{
		const cookieOrientation = mo.getCookie('o');
		if (moLayout.isPortrait() && (cookieOrientation != 1))
		{
			document.cookie = "o=1";
		}
		else if (!moLayout.isPortrait() && (cookieOrientation != 0))
		{
			document.cookie = "o=0";
		}

		const headerElement = mo.getElementById('headerLayout');
		const flexLayoutElement = mo.getElementById('flexLayout');
		const footerElement = mo.getElementById('footerLayout');

		const flexLayoutStyle = flexLayoutElement.getAttribute('style');

		const flextLayoutHeight = document.documentElement.clientHeight - headerElement.offsetHeight - footerElement.offsetHeight - 1;

		flexLayoutElement.setAttribute('style', flexLayoutStyle + `; min-height: ${flextLayoutHeight}px`);


		document.dispatchEvent(new Event("moLayoutChanged"));
	}

})();
