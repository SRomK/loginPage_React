export default class Common {
	static GetCommonUrl () {
		// Dev mode
		if (window.location.href.indexOf("localhost") !== -1)
			return 'http://localhost/common/';
		
		// Production mode
		return 'https://common.private-radar.com/';
	}
}