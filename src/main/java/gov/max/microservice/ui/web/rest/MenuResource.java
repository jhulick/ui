package gov.max.microservice.ui.web.rest;

import gov.max.microservice.ui.model.MenuItem;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * REST controller for managing the UI SPA application's Menu.
 * <p/>
 * This class accesses the User entity, and builds the menu based on Principle role/permissions.
 */
@RestController
public class MenuResource {

    private static List<MenuItem> menuItems = new ArrayList<>();

    @RequestMapping("/user")
    public Map<String, String> user(Principal user) {
        return Collections.singletonMap("name", user.getName());
    }

    @RequestMapping(value = "/sidebar", method = RequestMethod.GET, produces = "application/json")
    public List<MenuItem> sidebar(Principal user) {
        // TODO: check user permissions and return menu items per role/permission
        return menuItems;
    }

    @PostConstruct
    public void init() {
        menuItems.add(new MenuItem("Main Navigation", "true", "sidebar.heading.HEADER", null, null));
        menuItems.add(new MenuItem("Dashboard", null, "sidebar.nav.DASHBOARD", "icon-speedometer", "app.dashboard"));
        menuItems.add(new MenuItem("Documentation", null, "sidebar.nav.DOCUMENTATION", "icon-graduation", "app.documentation"));
    }
}
