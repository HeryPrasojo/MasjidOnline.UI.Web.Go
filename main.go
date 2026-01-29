package main

import (
	"fmt"
	"html/template"
	"net/http"
	"os"
	"strconv"

	"golang.org/x/text/language"
)

type Environment struct {
	BackendHost string
	Environment string
	StaticHost  string
}

type Orientation int

type Page struct {
	Title    string
	Template *template.Template
}

type PageData struct {
	Dict        map[string]string
	Environment *Environment
	Lang        string
	Orientation Orientation
	User        User
	Title       string
}

type User struct {
	Name string
	Type UserType
}

type UserType int

const (
	UserTypeUndefined UserType = UserType(0)
	UserTypeAnonymous UserType = UserType(1)
)

var dictionary2 []map[string]string

var environment Environment

var langs = map[string]int{
	"en": 0,
	"id": 1,
}

var langSwaps map[int]string

var langTags map[language.Tag]string

var languageMatcher language.Matcher

var pageFiles = []string{
	"base.html",
	"layout-ls.html",
	"layout-pt.html",
	"navigation-ls.html",
	"navigation-pt.html",
}

var pageWithNavigationFiles = append(
	pageFiles,
	"navigation-ls.html",
	"navigation-pt.html",
)

var pages = map[string]Page{
	// "/navigation": {
	// 	Template: template.Must(template.New("navigation.html").Funcs(template.FuncMap{"t": func() string { return "inside t" }}).ParseFiles("navigation.html", "navigation-ls.html", "navigation-pt.html")),
	// },
	// "/": {
	// 	Title:    "Home",
	// 	Template: template.Must(template.ParseFiles(append(pageWithNavigationFiles, "page/home-js.html", "page/home-ls.html", "page/home-pt.html")...)),
	// },
	// "/-content": {
	// 	Template: template.Must(template.ParseFiles("content.html", "page/home-ls.html", "page/home-pt.html")),
	// },
	"/about": {
		Title:    "About",
		Template: template.Must(template.New("base.html").Funcs(template.FuncMap{"t": t}).ParseFiles(append(pageWithNavigationFiles, "page/about-js.html", "page/about-ls.html", "page/about-pt.html")...)),
	},
	// "/about-content": {
	// 	Template: template.Must(template.ParseFiles("content.html", "page/about-ls.html", "page/about-pt.html")),
	// },
	// "/infaq": {
	// 	Title:    "Infaq",
	// 	Template: template.Must(template.ParseFiles(append(pageWithNavigationFiles, "page/infaq/infaq-js.html", "page/infaq/infaq-ls.html", "page/infaq/infaq-pt.html")...)),
	// },
	// "/infaq-content": {
	// 	Template: template.Must(template.ParseFiles("content.html", "page/infaq/infaq-ls.html", "page/infaq/infaq-pt.html")),
	// },
}

func main() {

	http.ListenAndServe(":81", nil)
}

func init() {

	environment = Environment{
		Environment: os.Args[1:][0],
	}

	switch environment.Environment {
	case "L":
		environment.BackendHost = "api.local.masjidonline.org"
		environment.StaticHost = "static.local.masjidonline.org"
	default:
		panic("Unknown environment")
	}

	dictionary2 = make([]map[string]string, len(langs))
	for i := range dictionary2 {

		dictionary2[i] = make(map[string]string)

		for k, v := range dictionary {

			vi := v[i]
			if vi == "" {
				vi = k
			}

			dictionary2[i][k] = vi
		}
	}

	langSwaps = make(map[int]string)
	for lang, i := range langs {
		langSwaps[i] = lang
	}

	langTags = make(map[language.Tag]string)
	for lang := range langs {
		langTags[language.MustParse(lang)] = lang
	}

	tags := make([]language.Tag, 0, len(langTags))
	for tag := range langTags {
		tags = append(tags, tag)
	}

	languageMatcher = language.NewMatcher(tags)

	if environment.Environment == "L" {
		http.HandleFunc("/", f2)
	} else {
		http.HandleFunc("/", f1)
	}
}

func f1(w http.ResponseWriter, r *http.Request) {

	var locale int
	cookie, _ := r.Cookie("l")
	if cookie == nil {

		c := http.Cookie{
			Name:  "l",
			Value: "0",
			// SameSite: http.SameSiteLaxMode, // Helps mitigate CSRF attacks
		}

		http.SetCookie(w, &c)

		requestTag, _, _ := language.ParseAcceptLanguage(r.Header.Get("Accept-Language"))

		selectedTag, _, _ := languageMatcher.Match(requestTag...)
		fmt.Println("selectedTag:", selectedTag)

		locale = langs[langTags[selectedTag]]

	} else {

		locale, _ = strconv.Atoi(cookie.Value)
	}

	var orientation Orientation
	cookie, _ = r.Cookie("o")
	if cookie == nil {

		c := http.Cookie{
			Name:  "o",
			Value: "0",
			// SameSite: http.SameSiteLaxMode, // Helps mitigate CSRF attacks
		}

		http.SetCookie(w, &c)

	} else {
		o, _ := strconv.Atoi(cookie.Value)
		orientation = Orientation(o)
	}

	var userType UserType
	cookie, _ = r.Cookie("u.t")
	if cookie == nil {

		c := http.Cookie{
			Name:  "u.t",
			Value: "1",
			// SameSite: http.SameSiteLaxMode, // Helps mitigate CSRF attacks
		}

		http.SetCookie(w, &c)

	} else {
		ut, _ := strconv.Atoi(cookie.Value)
		userType = UserType(ut)
	}
	if userType == UserTypeUndefined {
		userType = UserTypeAnonymous
	}

	page, ok := pages[r.URL.Path]
	if !ok {

		if environment.Environment == "L" {
			fmt.Println("not found")
		}

		http.NotFound(w, r)
	}

	pageData := PageData{
		Dict:        dictionary2[locale],
		Environment: &environment,
		Lang:        langSwaps[locale],
		Orientation: orientation,
		User: User{
			Type: userType,
		},
		Title: page.Title,
	}

	page.Template.Execute(w, pageData)
}

func f2(w http.ResponseWriter, r *http.Request) {

	fmt.Println("---\t", r.URL.Path)

	switch r.URL.Path {
	case "/favicon.ico":
	default:
		f1(w, r)
	}
}

func t() string {
	return "inside t 2"
}
