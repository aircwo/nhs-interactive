// not a true react component
export function wrapper(content: any) {
  return (
    <div className="nhsuk-width-container">
      <main className="nhsuk-main-wrapper" id="maincontent" role="main">
        <div className="nhsuk-grid-row">
          <div className="nhsuk-grid-column-two-thirds">
            { content }
          </div>
        </div>
      </main>
    </div>
  );
}
