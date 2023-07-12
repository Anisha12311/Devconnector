const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const { check, validationResult } = require("express-validator");
const User = require('../../models/User')
router.get("/me", auth, async (req, res) => {
  try {
    const ProfileUser = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avator"]
    );

    if (!ProfileUser) {
      res.status(400).json({ mess: "Profile is not found" });
    }

    res.status(200).json(ProfileUser);
  } catch (error) {}
});

router.post(
  "/",
  [
    auth,
    [
      check("skills", "Skill is required").not().isEmpty(),
      check("status", "status is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty) {
      return res.status(400).json(errors.array());
    }
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    // Skills - Spilt into array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",").map(skills => skills.trim())
    }

    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
try 
 {   
    console.log(req.user.id)
    const profile = await Profile.findOne({ user: req.user.id });

    if (profile) { 

      const UpdateProfile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      res.status(200).json(UpdateProfile);
      return;
    }

    //create profile

    const createProfile = new Profile(profileFields)
    await createProfile.save()
    res.status(200).json(createProfile)
    }
    catch(error){
        console.error(error.message)
        res.status(500).json("Server Error")
    }
  }
);


router.get('/user/:user_id', async(req,res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id })
        if(!profile){
            res.status(400).json("There is no profile for this user")
        }
        res.status(200).json(profile)
    } catch (error) {
        console.error(error)
        res.status(500).json("Server Error")
    }
})

router.delete('/',auth,async(req,res) => {

  try
  {
   await Profile.findOneAndRemove({user : req.user.id})
   await User.findOneAndRemove({_id : req.user.id})
    
   res.status(200).json("User Removed")
} catch(error){
   res.status(500).json("Server Error")
}

})
module.exports = router;
