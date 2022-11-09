import { useRef } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import styled from "styled-components";

const Section = styled.section`
  display: flex;
  height: calc(100% - 60px);
  flex: 1;
`;

const Manager = () => {
  const sidebarRef = useRef();

  return (
    <Section className="container">
      <Sidebar className="theme-bg-secondary" ref={sidebarRef} />
      <main className="h-100" style={{ flexGrow: 1 }}>
        <Outlet context={{ sidebarRef }} />
      </main>
    </Section>
  );
};

export default Manager;