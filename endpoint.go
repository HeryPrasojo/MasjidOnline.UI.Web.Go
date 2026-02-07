package main

import "html/template"

func buildEndpoints() {

	endpointFiles := []string{
		"base.html",
		"layout-ls.html",
		"layout-pt.html",
	}

	endpointWithNavigationFiles := append(
		endpointFiles,
		"navigation-ls.html",
		"navigation-pt.html",
	)

	endpointDatas := map[string]EndpointData{

		"/": {
			Title:         "Home",
			UseNavigation: true,
		},

		"/about": {
			Title:         "About",
			UseNavigation: true,
		},

		"/infaq": {
			Title:         "Infaq",
			UseNavigation: true,
		},

		"/infaq/list": {
			Title:         "Infaq List",
			UseNavigation: true,
		},

		"/infaq/payment/anonym/bankTransfer": {
			Title:         "Bank Transfer",
			UseNavigation: true,
		},

		"/infaq/payment/anonym/bankTransfer/confirm": {
			Title: "Bank Transfer Confirmation",
		},

		"/infaq/view": {
			Title:         "Infaq View",
			UseNavigation: true,
		},
	}

	for path, endpointData := range endpointDatas {

		file := path
		if file == "/" {
			file = "/home"
		}

		files := []string{"page" + file + "-js.html", "page" + file + "-ls.html", "page" + file + "-pt.html"}

		var templateFiles []string
		if endpointData.UseNavigation {
			templateFiles = append(endpointWithNavigationFiles, files...)
		} else {
			templateFiles = append(endpointFiles, files...)
		}

		endpoints[path] = Endpoint{
			Title:    endpointData.Title,
			Template: template.Must(template.ParseFiles(templateFiles...)),
		}

		endpoints[path+"-content"] = Endpoint{
			Template: template.Must(template.ParseFiles([]string{"content.html", "page" + file + "-ls.html", "page" + file + "-pt.html"}...)),
		}
	}

	endpoints["/dialog"] = Endpoint{
		Template: template.Must(template.ParseFiles("dialog.html", "dialog-ls.html", "dialog-pt.html")),
	}

	endpoints["/navigation"] = Endpoint{
		Template: template.Must(template.ParseFiles("navigation.html", "navigation-ls.html", "navigation-pt.html")),
	}
}
