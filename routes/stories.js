const express = require("express");
const router = express.Router();
const Story = require("../models/Story");
const User = require("../models/User");

const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");

router.get("/", (req, res) => {
    Story.find({ status: "public" })
        .populate("user")
        .sort({ date: "desc" })
        .then(stories => {
            // console.log(users);
            res.render("stories/index", {
                stories: stories
            });
        })
        .catch(err => console.log(err));
});

// Add story
router.get("/add", ensureAuthenticated, (req, res) => {
    res.render("stories/add");
});

// process add ftory
router.post("/", (req, res) => {
    let allowComments;
    if (req.body.allowComments) {
        allowComments = true;
    } else {
        allowComments = false;
    }
    const newStory = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: allowComments,
        user: req.user.id
    };

    new Story(newStory).save().then(story => {
        res.redirect(`/stories/show/${story._id}`);
    });
});

// show single story
router.get("/show/:id", (req, res) => {
    Story.findOne({
            _id: req.params.id
        })
        .populate("user")
        .populate("comments.commentUser")
        .then(story => {
            res.render("stories/show", {
                story: story
            });
        })
        .catch(err => console.log(err));
});

//Edit Story Form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
    Story.findOne({ _id: req.params.id })
        .populate("user")
        .then(story => {
            if (story.user._id != req.user.id) {
                console.log(story.user._id, req.user.id);
                res.redirect("/stories");
            } else {
                res.render("stories/edit", {
                    story: story
                });
            }
        });
});

// edit form process
router.put("/:id", (req, res) => {
    Story.findOne({
            _id: req.params.id
        })
        .populate("user")
        .then(story => {
            let allowComments;
            if (req.body.allowComments) {
                allowComments = true;
            } else {
                allowComments = false;
            }

            // new value
            story.title = req.body.title;
            story.body = req.body.body;
            story.status = req.body.status;
            story.allowComments = allowComments;

            story.save().then(story => res.redirect("/dashboard"));
        });
});

// delete story
router.delete("/:id", (req, res) => {
    Story.remove({ _id: req.params.id }).then(() => res.redirect("/dashboard"));
});

// add comment
router.post("/comment/:id", ensureAuthenticated, (req, res) => {
    Story.findOne({ _id: req.params.id })
        .then(story => {
            const newComment = {
                commentBody: req.body.commentBody,
                commentUser: req.user.id
            };

            // add comment to arry
            story.comments.unshift(newComment);
            story
                .save()
                .then(story => {
                    res.redirect(`/stories/show/${story.id}`);
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
});

// list stories from user
router.get("/user/:userId", (req, res) => {
    Story.find({ user: req.params.userId, status: "public" })
        .populate("user")
        .then(stories => {
            res.render("stories/index", {
                stories: stories
            });
        });
});

// login user stories
router.get("/my", ensureAuthenticated, (req, res) => {
    Story.find({ user: req.user.id })
        .populate("user")
        .then(stories => {
            res.render("stories/index", {
                stories: stories
            });
        });
});

module.exports = router;