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
			Path:          "/home",
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

		"/login": {
			Path:  "/user/login",
			Title: "User Login",
		},

		"/upe": {
			Path:  "/user/password",
			Title: "User Password",
		},
	}

	for path, endpointData := range endpointDatas {

		var file string

		if endpointData.Path != "" {
			file = endpointData.Path
		} else {
			file = path
		}

		files := []string{"page" + file + "-head.html", "page" + file + "-ls.html", "page" + file + "-pt.html"}

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
