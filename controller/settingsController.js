import privacySettingsModel from "../Models/settings/privacySettingsModel.js";

// Privacy 
export const savePrivacySettings = async (req, res) => {
  try {
    const userId = req.user.id;

    const { photoVisibility, canAddMe, canMessageMe } = req.body;

    let settings = await privacySettingsModel.findOne({ userId });

    if (settings) {
      // تحديث الإعدادات إن وجدت
      settings.photoVisibility = photoVisibility;
      settings.canAddMe = canAddMe;
      settings.canMessageMe = canMessageMe;
    } else {
      // أو إنشاء جديدة إن لم توجد
      settings = new privacySettingsModel({
        userId,
        photoVisibility,
        canAddMe,
        canMessageMe,
      });
    }

    await settings.save();

    res.status(200).json({
      message: "Privacy settings updated successfully",
      data: settings,
    });
  } catch (error) {
    console.error("❌ Error saving privacy settings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPrivacySettings = async (req, res) => {
  try {
    const userId = req.user.id;

    const settings = await privacySettingsModel.findOne({ userId });

    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }

    res.status(200).json({ data: settings });
  } catch (error) {
    console.error("❌ Error getting privacy settings:", error);
    res.status(500).json({ message: "Server error" });
  }
};
