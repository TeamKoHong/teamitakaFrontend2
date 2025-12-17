import React from "react";
import Header from "../components/Header";
import ProfileImage from "../components/ProfileImage";
import ProfilePotato from "../assets/profile_potato.png";
import BasicInfo from "../components/BasicInfo";
import "./ProfileEdit.css";
import MajorInput from "../components/MajorInput";
import TeamExperience from "../components/TeamExperience";
import InterestKeywords from "../components/InterestKeywords";
import Withdrawal from "../components/Withdrawal";


export default function ProfileEdit() {
  return (
    <div className="page-frame">
      <Header />
      <ProfileImage src={ProfilePotato} />
      <BasicInfo />
      <MajorInput />
      <TeamExperience />
      <InterestKeywords />
      <Withdrawal />
    </div>
  );
}
