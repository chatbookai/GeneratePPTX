import axios from "axios";

export async function fetchTemplateList() {
  try {
    const response = await axios.get(
      "http://localhost:1988/api/pptx/getTemplatesList"
    );
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching templates:", error);
    return [];
  }
}

export async function fetchTemplateById(templateId: any) {
  try {
    const response = await axios.get(
      `http://localhost:1988/api/pptx/getTemplateById/${templateId}`
    );

    console.log("fetchTemplateById response", response.data);

    return response.data;
  } catch (error) {
    console.error(`Error fetching template by id: ${templateId}`, error);
    return null; // 在出错时返回null
  }
}
