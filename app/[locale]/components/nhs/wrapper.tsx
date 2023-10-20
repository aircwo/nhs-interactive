// not a true react component
export function wrapper(content: any, maintenanceMode: boolean) {
  return (
    <div className="nhsuk-width-container">
      <main className="nhsuk-main-wrapper" id="maincontent" role="main">
        <div className="nhsuk-grid-row">
          <div className="nhsuk-grid-column-three-quarters mt-5 mb-10">
            { maintenanceMode ? <>API unavailable</> : content }
          </div>
        </div>
      </main>
    </div>
  );
}
