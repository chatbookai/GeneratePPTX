import { Request, Response } from "express";
import { log } from "./utils";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import useragent from "useragent";
import fs from "fs";

import path from "path";
import { DataDir } from "./const";

dotenv.config();

import { db, getDbRecord, getDbRecordALL } from "./db";
import { slidesTemplate } from "./const.pptx";

type SqliteQueryFunction = (sql: string, params?: any[]) => Promise<any[]>;

const secretKey: string = process.env.JWT_TOKEN_SECRET_KEY || "ChatBookAI";

export const getPPTXTemplate = () => {
  return slidesTemplate;
};

export async function getPPTXContent(id: number) {
  const Records: any = await (getDbRecord as SqliteQueryFunction)(
    "SELECT * from pptx where id = ? ",
    [id]
  );
  const slidesData =
    Records && Records.slides ? JSON.parse(Records.slides) : {};
  return slidesData;
}

export async function getTemplatesList() {
  const filePath = path.join(DataDir + "/ppttemplate/templateList.json");
  console.log("filePath", filePath);
  try {
    const data = await fs.promises.readFile(filePath, "utf8");
    const templatesList = JSON.parse(data);
    return templatesList;
  } catch (error) {
    console.error("Error reading template file:", error);
    throw error;
  }
}

export async function updateTemplateList() {
  const templatesDir = path.join(DataDir, "/ppttemplate/");
  const templateFiles = await fs.promises.readdir(templatesDir);

  const templateList = [];

  for (const file of templateFiles) {
    if (file === "templateList.json") continue; // Skip the index file itself

    const filePath = path.join(templatesDir, file);
    try {
      const data = await fs.promises.readFile(filePath, "utf8");
      const templates = JSON.parse(data);
      if (templates.length > 0) {
        // Assuming the first page of the template is what we want
        const firstPage = templates[0]; // Taking the first page
        templateList.push({
          id: firstPage.id, // Or some other unique identifier
          elements: firstPage.elements, // This might be modified depending on how you want to handle thumbnails
        });
      }
    } catch (error) {
      console.error(`Error processing template file ${file}:`, error);
      // Optionally, continue to the next file instead of throwing an error
      // throw error;
    }
  }

  // Now, write the aggregated template list back to the templateList.json file
  const templateListPath = path.join(templatesDir, "templateList.json");
  try {
    await fs.promises.writeFile(
      templateListPath,
      JSON.stringify(templateList, null, 2),
      "utf8"
    );
    console.log("Updated template list successfully");
  } catch (error) {
    console.error("Error writing template list file:", error);
    throw error; // Or handle the error as appropriate
  }
}

export async function getTemplatesById(templateId: any) {
  const filePath = path.join(DataDir + "/ppttemplate/" + templateId + ".json");
  console.log("filePath", filePath);
  try {
    const data = await fs.promises.readFile(filePath, "utf8");
    return data;
  } catch (error) {
    console.error("Error reading template file:", error);
    throw error;
  }
}

export async function setTitle(Data: any) {
  console.log("Data", Data);
  const updateSetting = db.prepare("update pptx set title = ? where id = ?");
  updateSetting.run(Data.title, Data.fileId);
  updateSetting.finalize();
  return { status: "ok", msg: "Update title success" };
}

export async function setSlides(Data: any) {
  console.log("Data", Data);
  const updateSetting = db.prepare("update pptx set slides = ? where id = ?");
  updateSetting.run(JSON.stringify(Data.slides), Data.fileId);
  updateSetting.finalize();
  return { status: "ok", msg: "Update setSlides success" };
}

export async function setSlide(Data: any) {
  console.log("Data setSlide", Data);
  const Records: any = await (getDbRecord as SqliteQueryFunction)(
    "SELECT * from pptx where id = ? ",
    [Data.fileId]
  );
  const slidesData =
    Records && Records.slides ? JSON.parse(Records.slides) : {};
  slidesData[Number(Data.slideIndex)] = { elements: Data.elements };
  console.log("Data slidesData", slidesData);
  const updateSetting = db.prepare("update pptx set slides = ? where id = ?");
  updateSetting.run(JSON.stringify(slidesData), Data.fileId);
  updateSetting.finalize();
  return { status: "ok", msg: "Update setSlide success" };
}

export async function addSlide(Data: any) {
  console.log("Data addSlide", Data);
  const Records: any = await (getDbRecord as SqliteQueryFunction)(
    "SELECT * from pptx where id = ? ",
    [Data.fileId]
  );
  const slidesData =
    Records && Records.slides ? JSON.parse(Records.slides) : {};
  console.log("Data slidesData", slidesData);
  const slidesArray = Object.values(slidesData);
  slidesArray.splice(Data.addIndex, 0, ...Data.addSlide);
  console.log("Data addSlide", slidesArray);
  const updateSetting = db.prepare("update pptx set slides = ? where id = ?");
  updateSetting.run(JSON.stringify(slidesArray), Data.fileId);
  updateSetting.finalize();
  return { status: "ok", msg: "Update addSlide success" };
}

export async function updateSlide(Data: any) {
  console.log("Data updateSlide", Data);
  const Records: any = await (getDbRecord as SqliteQueryFunction)(
    "SELECT * from pptx where id = ? ",
    [Data.fileId]
  );
  const slidesData =
    Records && Records.slides ? JSON.parse(Records.slides) : {};
  console.log("Data slidesData", slidesData);
  slidesData[Data.slideIndex] = {
    ...slidesData[Data.slideIndex],
    ...Data.props,
  };
  const slidesArray = Object.values(slidesData);
  console.log("Data updateSlide", slidesArray);
  const updateSetting = db.prepare("update pptx set slides = ? where id = ?");
  updateSetting.run(JSON.stringify(slidesArray), Data.fileId);
  updateSetting.finalize();
  return { status: "ok", msg: "Update updateSlide success" };
}

export async function setViewportRatio(Data: any) {
  const updateSetting = db.prepare(
    "update pptx set viewportRatio = ? where id = ?"
  );
  updateSetting.run(Data.viewportRatio, Data.fileId);
  updateSetting.finalize();
  return { status: "ok", msg: "Update viewportRatio success" };
}

export async function setTheme(Data: any) {
  console.log("Data updateSlide", Data);
  const Records: any = await (getDbRecord as SqliteQueryFunction)(
    "SELECT * from pptx where id = ? ",
    [Data.fileId]
  );
  const themeData = Records && Records.theme ? JSON.parse(Records.theme) : {};
  console.log("Data themeData", themeData);
  const themeDataNew = { ...themeData, ...Data.themeProps };
  const updateSetting = db.prepare("update pptx set theme = ? where id = ?");
  updateSetting.run(JSON.stringify(themeDataNew), Data.fileId);
  updateSetting.finalize();
  return { status: "ok", msg: "Update setTheme success" };
}
