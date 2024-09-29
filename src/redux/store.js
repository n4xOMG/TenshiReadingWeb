import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "./authentication/auth.reducer";
import { bookReducer } from "./book/book.reducer";
import { chapterReducer } from "./chapter/chapter.reducer";
import { galleryReducer } from "./gallery/gallery.reducer";
import { commentReducer } from "./comment/comment.reducer";
import { userReducer } from "./user/user.reducer";
import { faqReducer } from "./faq/faq.reducer";

const rootReducers = combineReducers({
  auth: authReducer,
  book: bookReducer,
  user: userReducer,
  faq: faqReducer,
  comment: commentReducer,
  chapter: chapterReducer,
  gallery: galleryReducer,
});
export const store = legacy_createStore(rootReducers, applyMiddleware(thunk));
