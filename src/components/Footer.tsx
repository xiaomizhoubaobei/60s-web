import './Footer.css';

export default function Footer() {
  return (
    <footer className="homepage-footer">
      <div className="homepage-footer-content">
        <p>
          数据来源：
          <a
            href="https://github.com/vikiboss/60s"
            target="_blank"
            rel="noopener noreferrer"
          >
            60s API
          </a>
        </p>
        <p>
          <a
            href="https://github.com/xiaomizhoubaobei/60s-web"
            target="_blank"
            rel="noopener noreferrer"
          >
            项目源码
          </a>
        </p>
        <p>
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
          >
            渝ICP备2022010031号-8
          </a>
        </p>
        <p>
          <a
            href="https://icp.gov.moe/?keyword=20250975"
            target="_blank"
            rel="noopener noreferrer"
          >
            萌ICP备20250975号
          </a>
        </p>
      </div>
    </footer>
  );
}