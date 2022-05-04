const router = require("express").Router();
const path = require("path");
const { Collection, Item, User } = require("../models");
const { withAuth } = require("../utils/auth");

// routes for rendering the pages go here
// depending on how many we have, may want to break these out into separate files

// homepage
// displays 5? 10? most recently added items that have pictures and are public
// clicking any of them should redirect to login
router.get("/", async (req, res) => {
    try {
        const recentItemData = await Item.findAll({
            // logic for getting the items we want goes here
            // will need to be updated once we figure out photos
        });
        if (!recentItemData) {
            // what do we do if nothing satisfies this condition?
            res.render("homepage");
        }
        res.render("homepage", recentItems);
    } catch (err) {
        res.status(404).sendFile(path.join(__dirname, "../public", "404.html"));
    }
});

// login
// could make sign-up its own page
// could handle both on same page via client-side script
router.get("/login", (req, res) => {
    if (req.session.logged_in) {
        // do we want to send people to the front page, or to their dashboard?
        res.redirect("/");
        return;
    }
    res.render("login");
});

// user dashboard - with collections rendered, no items
// button to create new collection
// could be its own page, or could be handled client side with a modal
// think about mobile-friendly here
router.get("/:username/dashboard", withAuth, async (req, res) => {
    try {
        // username needs to be a valid user that is connected to the session
        // maybe this is middleware?
        // otherwise we can use a function to validate
        // either way we need to capture the userID
        // if we use a function, should return a userId or false, such as
        // const userId = await validUser(req.params.username)
        // either way, we probably need to add a parameter to session to identify the user

        // then needs to get all collections by user id, no items
        const collectionData = await Collection.findByPk(userId);
    } catch (err) {
        res.status(404).sendFile(path.join(__dirname, "../public", "404.html"));
    }
});

// single collection view - with item names, maybe pictures? no details
// can handle item inspection on the client side, with a modal
// or have page for looking at single items
// consider mobile users

// render all items in a collection
router.get("/:username/collections/:id", withAuth, async (req, res) => {
    try {
        // this will need the same verification/authorization as the dashboard
        const collectionData = await Collection.findByPk(req.params.id, {
            include: [
                {
                    model: Item,
                    attributes: ["name"],
                },
            ],
        });
        if (!collectionData) {
            res.status(404).sendFile(
                path.join(__dirname, "../public", "404.html")
            );
        }
        // to render the dashboard
        const collection = Data.map((item) => items.get({ plain: true }));

        res.render("dashboard", {
            collection,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// find item by id
// this should have the option to edit the item
// do we want to handle that on-page client side, or render a new page for it
router.get("/:username/items/:id", withAuth, async (req, res) => {
    try {
        const itemData = await Item.findByPk(req.params.id);
        // when we figure out images, that will need to be included

        if (!itemData) {
            res.status(404).sendFile(
                path.join(__dirname, "../public", "404.html")
            );
        }
        // will this be a full page render, or handled client side?
        res.render("item", itemData);
    } catch (err) {
        res.status(500).json(err);
    }
});

// about us page
// hard coded information?
// something fun here would be nice
router.get("/about", async (req, res) => {
    try {
        res.render("about");
    } catch (err) {
        res.status(404).sendFile(path.join(__dirname, "../public", "404.html"));
    }
});

module.exports = router;
