import { body } from "express-validator";
import { validatorHandler } from "./validatorHandler";

const validateTitle = body("title")
  .trim()
  .isLength({ min: 3, max: 140 })
  .withMessage("Title must be between 3 and 140 characters.");

const validatePostContent = body("content")
  .trim()
  .isLength({ max: 5000 })
  .withMessage("Post content must not be longer than 5000 characters.");

const validatePublishDate = body("publishDate").trim().isISO8601();

const validateCommentContent = body("content")
  .isLength({ min: 2, max: 1000 })
  .withMessage("Comments must be between 2 and 1000 characters");

// TODO?: validate postid for comment

export const postValidators = [
  validateTitle,
  validatePostContent,
  validatePublishDate,
  validatorHandler,
];

export const commentValidators = [validateCommentContent, validatorHandler];
