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
	Files         []string
	Path          string
	UseNavigation bool
	Title         string
}

type Environment struct {
	BackendHost string
	Environment string
	StaticHost  string
}

type Orientation int

type Permission struct {
	AccountancyExpenditureAdd     bool
	AccountancyExpenditureApprove bool
	InfaqStatusApprove            bool
	InfaqStatusRequest            bool
	UserInternalAdd               bool
	UserInternalApprove           bool
	UserInternalPermissionUpdate  bool
}

type TemplateData struct {
	Dict        map[string]string
	Environment *Environment
	Lang        string
	Orientation Orientation
	Permission  *Permission
	User        *User
	Title       string
}

type User struct {
	Name string
	Type UserType
}

type UserType int

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

	fmt.Println("Listening and serving...")

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
		http.HandleFunc("/", handleLocalHttp)
	} else {
		http.HandleFunc("/", handleHttp)
	}
}

func handleHttp(w http.ResponseWriter, r *http.Request) {

	var locale int
	cookie, _ := r.Cookie("l")
	if cookie == nil {

		requestTag, _, _ := language.ParseAcceptLanguage(r.Header.Get("Accept-Language"))

		selectedTag, _, _ := languageMatcher.Match(requestTag...)
		fmt.Println("selectedTag:", selectedTag)

		locale = langs[langTags[selectedTag]]

	} else {

		locale, _ = strconv.Atoi(cookie.Value)
	}

	var orientation Orientation
	cookie, _ = r.Cookie("o")
	if cookie != nil {

		o, _ := strconv.Atoi(cookie.Value)

		orientation = Orientation(o)
	}

	var permission Permission
	cookie, _ = r.Cookie("p.ae.ad")
	if cookie != nil {

		o, _ := strconv.Atoi(cookie.Value)
		if o == 1 {
			permission.AccountancyExpenditureAdd = true
		}
	}
	cookie, _ = r.Cookie("p.ae.ap")
	if cookie != nil {

		o, _ := strconv.Atoi(cookie.Value)
		if o == 1 {
			permission.AccountancyExpenditureApprove = true
		}
	}
	cookie, _ = r.Cookie("p.ii.ap")
	if cookie != nil {

		o, _ := strconv.Atoi(cookie.Value)
		if o == 1 {
			permission.InfaqStatusApprove = true
		}
	}
	cookie, _ = r.Cookie("p.ii.re")
	if cookie != nil {

		o, _ := strconv.Atoi(cookie.Value)
		if o == 1 {
			permission.InfaqStatusRequest = true
		}
	}
	cookie, _ = r.Cookie("p.ui.ad")
	if cookie != nil {

		o, _ := strconv.Atoi(cookie.Value)
		if o == 1 {
			permission.UserInternalAdd = true
		}
	}
	cookie, _ = r.Cookie("p.ui.ap")
	if cookie != nil {

		o, _ := strconv.Atoi(cookie.Value)
		if o == 1 {
			permission.UserInternalApprove = true
		}
	}
	cookie, _ = r.Cookie("p.ui.pu")
	if cookie != nil {

		o, _ := strconv.Atoi(cookie.Value)
		if o == 1 {
			permission.UserInternalPermissionUpdate = true
		}
	}

	var userType UserType
	cookie, _ = r.Cookie("u.t")
	if cookie != nil {

		ut, _ := strconv.Atoi(cookie.Value)

		userType = UserType(ut)
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
		Permission:  &permission,
		User: &User{
			Type: userType,
		},
		Title: endpoint.Title,
	}

	endpoint.Template.Execute(w, templateData)
}

func handleLocalHttp(w http.ResponseWriter, r *http.Request) {

	fmt.Println("--- ", r.URL.Path)

	switch r.URL.Path {
	case "/favicon.ico":
	default:
		handleHttp(w, r)
	}
}

func (templateData TemplateData) T(key string) string {

	value, result := templateData.Dict[key]

	if !result {
		return key
	}

	return value
}

func setCookie(w http.ResponseWriter, name string, value string) {

	c := http.Cookie{
		Name:  name,
		Path:  "/",
		Value: value,
		// SameSite: http.SameSiteLaxMode, // Helps mitigate CSRF attacks
	}

	http.SetCookie(w, &c)
}
