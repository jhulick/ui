package gov.max.microservice.ui.model;

import com.fasterxml.jackson.annotation.JsonInclude;

// should return
// [{"text":"Main Navigation","heading":"true","translate":"sidebar.heading.HEADER"},{"text":"Dashboard","sref":"app.dashboard","icon":"icon-speedometer","translate":"sidebar.nav.DASHBOARD"},{"text":"Documentation","sref":"app.documentation","icon":"icon-graduation","translate":"sidebar.nav.DOCUMENTATION"}]
// [{"text":"Main Navigation","heading":"true","translate":"sidebar.heading.HEADER"},{"text":"Dashboard","translate":"sidebar.heading.HEADER","icon":"icon-speedometer","sref":"app.dashboard"},{"text":"Documentation","translate":"sidebar.heading.DOCUMENTATION","icon":"icon-graduation","sref":"app.documentation"}]
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MenuItem {

    public MenuItem(String text, String heading, String translate, String icon, String sref) {
        this.text = text;
        this.sref = sref;
        this.heading = heading;
        this.translate = translate;
        this.icon = icon;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getHeading() {
        return heading;
    }

    public void setHeading(String heading) {
        this.heading = heading;
    }

    public String getTranslate() {
        return translate;
    }

    public void setTranslate(String translate) {
        this.translate = translate;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getSref() {
        return sref;
    }

    public void setSref(String sref) {
        this.sref = sref;
    }

    private String text;
    private String heading;
    private String translate;
    private String icon;
    private String sref;

}