package main

import (
	"fmt"
	"html/template"
	"net/http"
	"os"
	"strconv"

	"golang.org/x/text/language"
)

type Endpoint struct {
	Title    string
	Template *template.Template
}

type EndpointData struct {
	UseNavigation bool
	Title         string
	Files         []string
}

type Environment struct {
	BackendHost string
	Environment string
	StaticHost  string
}

type Orientation int

type User struct {
	Name string
	Type UserType
}

type TemplateData struct {
	Dict        map[string]string
	Environment *Environment
	Lang        string
	Orientation Orientation
	User        *User
	Title       string
}

type UserType int

const (
	UserTypeUndefined UserType = UserType(0)
	UserTypeAnonymous UserType = UserType(1)
)

var dictionary2 []map[string]string

var endpoints = map[string]Endpoint{}

var environment Environment

var langs = map[string]int{
	"en": 0,
	"id": 1,
}

var langSwaps map[int]string

var langTags map[language.Tag]string

var languageMatcher language.Matcher

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

	buildEndpoints()

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
			Path:  "/",
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
			Path:  "/",
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
			Path:  "/",
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

	endpoint, ok := endpoints[r.URL.Path]
	if !ok {

		if environment.Environment == "L" {
			fmt.Println("not found")
		}

		http.NotFound(w, r)
	}

	templateData := TemplateData{
		Dict:        dictionary2[locale],
		Environment: &environment,
		Lang:        langSwaps[locale],
		Orientation: orientation,
		User: &User{
			Type: userType,
		},
		Title: endpoint.Title,
	}

	endpoint.Template.Execute(w, templateData)
}

func f2(w http.ResponseWriter, r *http.Request) {

	fmt.Println("--- ", r.URL.Path)

	switch r.URL.Path {
	case "/favicon.ico":
	default:
		f1(w, r)
	}
}

func (templateData TemplateData) T(key string) string {

	value, result := templateData.Dict[key]

	if !result {
		return key
	}

	return value
}
