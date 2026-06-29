package main

import (
	"html/template"
	"maps"
)

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

	endpoints = map[string]Endpoint{

		"/": {
			Path:          "/home",
			Title:         "Home",
			UseNavigation: true,
		},

		"/about": {
			Title:         "About",
			UseNavigation: true,
		},

		"/donation": {
			Title:         "Donation",
			UseNavigation: true,
		},

		"/donation/list": {
			Title:         "Donation List",
			UseNavigation: true,
		},

		"/donation/payment/anonym/bankTransfer": {
			Title:         "Bank Transfer",
			UseNavigation: true,
		},

		"/donation/payment/anonym/bankTransfer/confirm": {
			Title: "Bank Transfer Confirmation",
		},

		"/donation/view": {
			Title:         "Donation View",
			UseNavigation: true,
		},

		"/login": {
			AuthorizeFunction: func(userType UserType, permission *Permission) bool {
				return userType == 1
			},
			Path:  "/user/login",
			Title: "User Login",
		},

		"/upe": {
			Path:  "/user/password",
			Title: "User Password",
		},

		"/user/internal/add": {
			AuthorizeFunction: func(userType UserType, permission *Permission) bool {
				return (userType == 5) && permission.UserInternalAdd
			},
			Title:         "Internal User Add",
			UseNavigation: true,
		},

		"/user/internal/list": {
			AuthorizeFunction: func(userType UserType, permission *Permission) bool {
				return (userType == 5) && (permission.UserInternalAdd || permission.UserInternalApprove)
			},
			Title:         "Internal User List",
			UseNavigation: true,
		},

		"/user/internal/permission": {
			AuthorizeFunction: func(userType UserType, permission *Permission) bool {
				return (userType == 5) && permission.UserInternalPermissionUpdate
			},
			Title:         "Internal User Permission",
			UseNavigation: true,
		},

		"/user/internal/view": {
			AuthorizeFunction: func(userType UserType, permission *Permission) bool {
				return (userType == 5) && (permission.UserInternalAdd || permission.UserInternalApprove)
			},
			Title:         "Internal User",
			UseNavigation: true,
		},

		"/user/register": {
			AuthorizeFunction: func(userType UserType, permission *Permission) bool {
				return userType == 1
			},
			Title: "User Registration",
		},

		"/vre": {
			AuthorizeFunction: func(userType UserType, permission *Permission) bool {
				return userType == 1
			},
			Path:  "/user/register/verify",
			Title: "Verify Registration Email",
		},
	}

	var contentEndpoints map[string]Endpoint = make(map[string]Endpoint)

	for path, endpoint := range endpoints {

		if endpoint.Path == "" {
			endpoint.Path = path
		}

		files := []string{"page" + endpoint.Path + "-head.html", "page" + endpoint.Path + "-ls.html", "page" + endpoint.Path + "-pt.html"}

		var templateFiles []string
		if endpoint.UseNavigation {
			templateFiles = append(endpointWithNavigationFiles, files...)
		} else {
			templateFiles = append(endpointFiles, files...)
		}

		endpoints[path] = Endpoint{
			AuthorizeFunction: endpoint.AuthorizeFunction,
			// Path:          endpoint.Path,
			Title:    endpoint.Title,
			Template: template.Must(template.ParseFiles(templateFiles...)),
			// UseNavigation: endpoint.UseNavigation,
		}

		files = []string{"content.html", "page" + endpoint.Path + "-ls.html", "page" + endpoint.Path + "-pt.html"}

		contentEndpoints[path+"-content"] = Endpoint{
			AuthorizeFunction: endpoint.AuthorizeFunction,
			Template:          template.Must(template.ParseFiles(files...)),
		}
	}

	maps.Copy(endpoints, contentEndpoints)

	endpoints["/dialog"] = Endpoint{
		Template: template.Must(template.ParseFiles("dialog.html", "dialog-ls.html", "dialog-pt.html")),
	}

	endpoints["/navigation"] = Endpoint{
		Template: template.Must(template.ParseFiles("navigation.html", "navigation-ls.html", "navigation-pt.html")),
	}
}
