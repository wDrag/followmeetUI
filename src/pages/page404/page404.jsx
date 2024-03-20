import "./page404.scss";

const Page404 = () => {
  return (
    <div className="page404">
      <img
        className="page404__img"
        src="https://i.kym-cdn.com/entries/icons/original/000/047/264/josh_hutcherson_whistle.jpg"
        alt="404"
      />
      <span className="page404__code">404</span>
      <span className="page404__text">Oops!!! Page not found</span>
    </div>
  );
};

export default Page404;
