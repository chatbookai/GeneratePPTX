// app.ts
import express, { Request, Response, NextFunction } from "express";

import {
  checkUserPassword,
  registerUser,
  changeUserPasswordByToken,
  changeUserDetail,
  changeUserStatus,
  checkUserToken,
  getUsers,
  getUserLogsAll,
  getUserLogs,
  getOneUserByToken,
  updateUserImageFavorite,
  updateUserVideoFavorite,
  refreshUserToken,
} from "../utils/user";

import {
  getTemplatesById,
  updateTemplateList,
  getPPTXContent,
  getTemplatesList,
  getPPTXTemplate,
  setTitle,
  setTheme,
  setViewportRatio,
  setSlides,
  setSlide,
  addSlide,
  updateSlide,
} from "../utils/pptx";

const app = express();

app.get("/api/pptx/listtemplate", async (req: Request, res: Response) => {
  //const { authorization } = req.headers;
  //const checkUserTokenData = await checkUserToken(authorization as string);
  const result = await getPPTXTemplate();
  res.status(200).json(result);
  res.end();
});

app.get("/api/pptx/getTemplatesList", async (req: Request, res: Response) => {
  try {
    await updateTemplateList(); // Update the template list before retrieving it
    const templates = await getTemplatesList(); // Then, get the updated list
    res.status(200).json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ message: "Error fetching templates" });
  }
});

app.get(
  "/api/pptx/getTemplateById/:templateId",
  async (req: Request, res: Response) => {
    console.log("req.params.templateId", req.params.templateId);
    try {
      const data = await getTemplatesById(req.params.templateId);
      const template = JSON.parse(data);
      console.log("template", template);
      res.status(200).json(template);
    } catch (error) {
      console.error(`Error fetching template ${req.params.templateId}:`, error);
      res
        .status(500)
        .json({ message: `Error fetching template ${req.params.templateId}` });
    }
  }
);

app.post("/api/pptx/getPPTXContent", async (req: Request, res: Response) => {
  //const { authorization } = req.headers;
  //const checkUserTokenData = await checkUserToken(authorization as string);
  console.log("req.body.id", req.body.id);
  const result = await getPPTXContent(req.body.id);
  res.status(200).json(result);
  res.end();
});

app.post("/api/pptx/setTitle", async (req: Request, res: Response) => {
  //const { authorization } = req.headers;
  //const checkUserTokenData = await checkUserToken(authorization as string);
  const result = await setTitle(req.body);
  res.status(200).json(result);
  res.end();
});

app.post("/api/pptx/setTheme", async (req: Request, res: Response) => {
  //const { authorization } = req.headers;
  //const checkUserTokenData = await checkUserToken(authorization as string);
  const result = await setTheme(req.body);
  res.status(200).json(result);
  res.end();
});

app.post("/api/pptx/setViewportRatio", async (req: Request, res: Response) => {
  //const { authorization } = req.headers;
  //const checkUserTokenData = await checkUserToken(authorization as string);
  const result = await setViewportRatio(req.body);
  res.status(200).json(result);
  res.end();
});

app.post("/api/pptx/setSlides", async (req: Request, res: Response) => {
  //const { authorization } = req.headers;
  //const checkUserTokenData = await checkUserToken(authorization as string);
  const result = await setSlides(req.body);
  res.status(200).json(result);
  res.end();
});

app.post("/api/pptx/setSlide", async (req: Request, res: Response) => {
  //const { authorization } = req.headers;
  //const checkUserTokenData = await checkUserToken(authorization as string);
  const result = await setSlide(req.body);
  res.status(200).json(result);
  res.end();
});

app.post("/api/pptx/addSlide", async (req: Request, res: Response) => {
  //const { authorization } = req.headers;
  //const checkUserTokenData = await checkUserToken(authorization as string);
  const result = await addSlide(req.body);
  res.status(200).json(result);
  res.end();
});

app.post("/api/pptx/updateSlide", async (req: Request, res: Response) => {
  //const { authorization } = req.headers;
  //const checkUserTokenData = await checkUserToken(authorization as string);
  const result = await updateSlide(req.body);
  res.status(200).json(result);
  res.end();
});

app.post("/api/pptx/setSlides", async (req: Request, res: Response) => {
  //const { authorization } = req.headers;
  //const checkUserTokenData = await checkUserToken(authorization as string);
  const result = await setSlides(req.body);
  res.status(200).json(result);
  res.end();
});

export default app;
