const router = require("koa-router")();

import Club from "../controller/clubs";
import ClubItem from "../controller/clubItems";

router.post("/club", Club.create);

router.get("/club", Club.getClub);

router.put("/club/:id", Club.update);

router.get("/clubs", Club.getClubs);

router.delete("/club", Club.delete);

router.post("/setMinister", ClubItem.setMinister);

router.post("/setViceMinister", ClubItem.setViceMinister);

router.get("/apply", ClubItem.getApply);

router.get("/join", ClubItem.getJoin);

router.post("/checkItem", ClubItem.check);

router.post("/clubItem", ClubItem.create);

router.delete("/clubItem", ClubItem.delete);

router.get("/clubUser", ClubItem.getUser);

router.put("/clubItem", ClubItem.updateLevel);

module.exports = router;
